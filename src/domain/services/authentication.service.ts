import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageService } from "../../common/local-storage.service";
import { BehaviorSubject, Observable, map, throwError, catchError, of } from "rxjs";
import { AppConstant } from "../../common/app-constant";

import { LoginModel, Token } from "../models/login.model";
import { ApiService } from "./base-service/api.service";
import { Router } from "@angular/router";
import { CommonMapperService } from "./mappers/CommonMapperService";
import { NotificationModel } from "../models/notification.model";
import { BaseResponse } from "../models/base.model";

@Injectable({
	providedIn: 'root'
})

export class AuthenticationService {
	public loginToken: Observable<Token>;
	private currentTokenSubject: BehaviorSubject<Token>;
	userAccessToken: any;

	constructor(private apiService: ApiService,
		public router: Router,
		private localStorageService: LocalStorageService,
		private mapper: CommonMapperService
	) {
		const storedToken = localStorage.getItem(AppConstant.K_TOKEN);
		if (storedToken) {
			this.userAccessToken = JSON.parse(storedToken);
		}
		this.currentTokenSubject = new BehaviorSubject<Token>(this.userAccessToken);
		this.loginToken = this.currentTokenSubject.asObservable();
	}

	authentication(obj: any, URL: any): Observable<LoginModel> {
		return this.apiService.post<LoginModel>(URL, obj).pipe(
			map(token => {
				if (token) {
					this.localStorageService.setItem(AppConstant.K_TOKEN, JSON.stringify(token.data));
					this.currentTokenSubject?.next(token.data);
				}
				return token;
			})
		);
	}

	setProject(params: HttpParams, URL: any): Observable<LoginModel> {

		return this.apiService.post<LoginModel>(URL, {}, params).pipe(
			map(token => {
				if (token) {
					this.localStorageService.setItem(AppConstant.K_TOKEN, JSON.stringify(token.data));
					this.currentTokenSubject?.next(token.data);
				}
				return token;
			})
		);
	}

	isLoggedIn() {
		return this.localStorageService.getItem(AppConstant.K_TOKEN) != null;
	}

	public get currentTokenValue(): Token {
		return this.currentTokenSubject.value;
	}

	logout() {

		this.localStorageService.clear();

		this.router.navigate(['/login']);
	}

	getNotification(url: any, params: HttpParams): Observable<BaseResponse<NotificationModel[]>> {
		return this.apiService.get<BaseResponse<NotificationModel[]>>(url, params);
	}

	readNotification(url: any, obj: any): Observable<BaseResponse<NotificationModel[]>> {
		return this.apiService.post<BaseResponse<NotificationModel[]>>(url, obj);
	}


	getRefreshToken(): string | null {
		return localStorage.getItem('refreshToken');
	}

	refreshAccessToken(): Observable<any> {

		let loginToken = this.currentTokenValue;

		const refreshToken = loginToken.refreshToken;
		if (!refreshToken) {
			return throwError(() => new Error('No refresh token available'));
		}

		let obj = {
			"platform": 1,
			"refreshToken": refreshToken
		}
		return this.apiService.post<LoginModel>(AppConstant.REFRESH_TOKEN, obj).pipe(
			map(token => {
				if (token) {

					this.localStorageService.setItem(AppConstant.K_TOKEN, JSON.stringify(token.data));
					this.currentTokenSubject?.next(token.data);
				}
				return token.data;
			})
		);
	}

	put(URL: any, obj: any): Observable<LoginModel> {
		return this.apiService.put<LoginModel>(URL, obj);
	}

	reAuthenticate(password: string): Observable<any> {
		const currentUser = this.localStorageService.getItem("username");
		if (!currentUser) {
			return throwError(() => new Error('No user logged in'));
		}
		let obj = {
			userName: currentUser,
			password: password,
		};

		return this.authentication(obj, AppConstant.LOGIN).pipe(
			map(response => {
				if (response.success) {
					this.currentTokenSubject.next(response.data);
					return { success: true };
				}
				return { success: false };
			}),
			catchError(error => {
				return of({ success: false });
			})
		);
	}

}
