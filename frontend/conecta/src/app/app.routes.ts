import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LayoutComponent } from './backoffice/layout/layout.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SidebarComponent } from './backoffice/sidebar/sidebar.component';
import { HeaderBackofficeComponent } from './backoffice/header-backoffice/header-backoffice.component';
import { authGuard } from './services/guards/auth.guard.service';

export const routes: Routes = [

    //home
    {path: "", component: HomeComponent},
    {path: "sign-in", component: SignInComponent},
    {path: "sign-up", component: SignUpComponent},
    {path: "contact", component: ContactComponent},
    

    //backoffice
    {
        path: "backoffice", canActivate: [authGuard], component: LayoutComponent, children: [
            {path: "header-backoffice", component: HeaderBackofficeComponent},
            {path: "sidebar", component: SidebarComponent},
        ]
    },

];

