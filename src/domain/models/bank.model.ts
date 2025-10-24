export class BankModel {
    id: number = 0;
    bankName: string = '';
}

export class BankResourceCodeModel {
    id: number = 0;
    codeTypeId: number = 0;
    name: string = '';
    enumItem: string = '';
    isDefault: boolean = false;
    isActive: boolean = true;
}

export class BankAccountModel {
    id: number = 0;
    bankName: string = '';
    prefixIFSCCode: string = '';
    accountName: string = '';
    accountNumber: string = '';
    ifscCode: string = '';
    branchCode: string = '';
    accountTypeId: number = 0;
    accountTypeName: string = '';
}
