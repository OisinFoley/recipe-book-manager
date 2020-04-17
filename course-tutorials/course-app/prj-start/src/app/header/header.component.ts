import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
	isAuthenticated = false;
	private userSub: Subscription;
	collapsed = false;

	constructor(
		private dataStorage: DataStorageService,
		private authService: AuthService,
		private store: Store<fromApp.AppState>
	) {}
	// @Output() featureSelected = new EventEmitter<string>();

	// onSelect(feature: string) {
	// 	this.featureSelected.emit(feature);
	// }
	// thr above is redundant after adding routing to our app

	ngOnInit() {
		this.userSub = this.store
			.select('auth')
			.pipe(map(authState => authState.user))
			.subscribe(user => {
		// coerce the opposite of !user so that we get a bool instead of the returned 'user' argument object
			this.isAuthenticated = !!user;
		});
	}


	onSaveData() {
		this.dataStorage.storeRecipes();
	}
	

	onFetchData() {
		this.dataStorage.fetchRecipes().subscribe();
	}

	onLogout() {
		this.authService.logout();
	}

	ngOnDestroy() {
		this.userSub.unsubscribe();
	}
}