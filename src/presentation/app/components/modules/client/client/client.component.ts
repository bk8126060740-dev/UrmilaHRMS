import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClientService } from '../../../../../../domain/services/client.service';
import { AppConstant } from '../../../../../../common/app-constant';
import { GlobalConfiguration } from '../../../../../../common/global-configration';
import { ClientDaum } from '../../../../../../domain/models/client.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { clientState } from '../../../../../../common/state/state.state';
import { editFormValue } from '../../../../../../common/state/state.action';
import { FilterService } from '../../../../../../domain/services/filter.service';
import { Data } from '../../../../../../domain/models/filter.model';
import { ExportService } from '../../../../../../domain/services/export.service';
import { GrantPermissionService } from '../../../../../../domain/services/permission/is-granted.service';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrl: './client.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ClientComponent implements OnInit {
    rowData: ClientDaum[] = [];
    totalCount: number = 0;
    pageNumber: number = 1;
    clientPerPage: number = 10;
    searchTerm: string = '';
    filterTerm: string = '';
    clientDataModel: ClientDaum = new ClientDaum();
    filterData: Data[] = [];
    fileDownloadUrl: string = '';
    orderby: string = '';
    columns = [
        {
            field: 'name',
            displayName: 'Name',
            sortable: true,
            filterable: true,
            visible: true,
            toggleOff: true,
            fixVisible: true
        },
        {
            field: 'address',
            displayName: 'Address',
            sortable: true,
            filterable: true,
            visible: false
        },
        {
            field: 'gstinOrUIN',
            displayName: 'GSTIN/UIN No.',
            sortable: true,
            filterable: true,
            visible: true,
            fixVisible: true
        },
        {
            field: 'panOrIT',
            displayName: 'PAN/IT No.',
            sortable: true,
            filterable: true,
            visible: true,
            fixVisible: true
        },
        {
            field: 'stateName',
            displayName: 'State',
            sortable: true,
            filterable: true,
            visible: true,
            fixVisible: true
        },
        {
            field: 'email',
            displayName: 'Email',
            sortable: true,
            filterable: true,
            visible: false
        },
        {
            field: 'contactNumber',
            displayName: 'Contact',
            sortable: true,
            filterable: true,
            visible: false
        },
        {
            field: 'tanNumber',
            displayName: 'TAN No.',
            sortable: true,
            filterable: true,
            visible: false
        },
        {
            field: '',
            displayName: 'Document',
            docButton: true,
            sortable: false,
            filterable: false,
            visible: true,
            fixVisible: true,
            isCenter: true
        },
        {
            field: '',
            displayName: 'Project',
            icon: 'addButton',
            sortable: false,
            filterable: false,
            visible: true,
            fixVisible: true,
            isCenter: true,
            button: true
        },
    ];

    constructor(
        private clientService: ClientService,
        private toaster: ToastrService,
        private router: Router,
        private store: Store<{ editForm: clientState }>,
        private grantPermissionService: GrantPermissionService,
        private exportService: ExportService
    ) { }

    @ViewChild('clientmodel') public clientmodel: ModalDirective | undefined;

    ngOnInit() {
        this.getClients();
        this.store.select('editForm').subscribe((data) => { });
    }
    orderBy(event: any) {
        this.orderby = event;
        this.getClients();
    }

    async getClients() {
        let params = new HttpParams()
            .set('PageNumber', this.pageNumber)
            .set('RecordCount', this.clientPerPage)
            .set('FilterBy', this.searchTerm)
            .set('OrderBy', this.orderby);
        await this.clientService.getClient(`${AppConstant.GET_CLIENT}`, params).subscribe({
            next: (response) => {
                if (response) {
                    this.rowData = response.data;
                    this.totalCount = response.totalCount;
                }
            }
        });
    }

    addClient() {
        this.clientDataModel = new ClientDaum();
        this.router.navigate(['client/create']);
    }

    onEdit(client: any) {
        this.clientDataModel = client;
        this.store.dispatch(
            editFormValue({
                name: client.name,
                description: client.description,
                id: client.id
            })
        );
        this.router.navigate(['client/create'], {
            state: { data: this.clientDataModel }
        });
    }

    onDelete(client: any) {
        this.confirmDelete(client);
    }

    confirmDelete(client: any) {
        swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            buttons: ['No', 'Yes'],
            dangerMode: true
        }).then((willDelete) => {
            if (willDelete) {
                this.deleteClient(client);
            } else {
                return;
            }
        });
    }

    async deleteClient(client: any) {
        let params = new HttpParams().set('id', client.id);
        await this.clientService.deleteClient(`${AppConstant.DELETE_CLIENT}/${client.id}`, params).subscribe({
            next: (response) => {
                if (response && response.success) {
                    GlobalConfiguration.consoleLog(
                        'Client Component',
                        'Delete response:',
                        response
                    );
                    this.rowData = this.rowData.filter((r) => r !== client);
                    this.toaster.success(response.message);
                    this.totalCount = this.totalCount - 1;
                }
            }
        });
    }

    onPageChange(page: any) {
        this.pageNumber = page;
        this.getClients();
    }

    onTotalClientPerPageValueChange(totalClient: number) {
        this.clientPerPage = totalClient;
        this.pageNumber = 1;
        this.getClients();
    }

    onSearch(event: string) {
        this.searchTerm = event;
        this.getClients();
    }

    async onAddProject(event: any) {
        let isPermission;
        (await this.grantPermissionService.hasSpecialPermission("Write", 34)).subscribe({
            next: (responce) => {
                isPermission = responce;
            }
        })
        if (isPermission) {
            this.router.navigate(['project/create'], {
                state: { clientData: event }
            });
        } else {
            this.toaster.warning("You don't have rights for this!!!")
        }
    }

    export() {
        this.exportService.get(AppConstant.GET_EXPORT_CLIENT).subscribe({
            next: (response: Blob) => {
                this.downloadFile(response);
            },
            error: (error) => { }
        });
    }

    downloadFile(blob: Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ClientList_Export.xlsx'; // Specify the default file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}
