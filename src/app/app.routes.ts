import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Storage } from './storage/storage';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'storage', component: Storage }
];
