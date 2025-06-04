import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LayoutComponent } from './backoffice/layout/layout.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SidebarComponent } from './backoffice/sidebar/sidebar.component';
import { HeaderBackofficeComponent } from './backoffice/header-backoffice/header-backoffice.component';
import { authGuard } from './services/guards/auth.guard.service';
import { NoteComponent } from './backoffice/note/note.component';
import { ConectionsComponent } from './backoffice/conections/conections.component';
import { UserComponent } from './backoffice/user/user.component';
import { ProjectOptionsSidebarComponent } from './backoffice/project-options-sidebar/project-options-sidebar.component';
import { FolderPanelComponent } from './backoffice/folder-panel/folder-panel.component';
import {publicGuard} from './services/guards/public.guard.service';

export const routes: Routes = [

    //home
    {path: "",canActivate:[publicGuard], component: HomeComponent},
    {path: "sign-in",canActivate:[publicGuard], component: SignInComponent},
    {path: "sign-up",canActivate:[publicGuard], component: SignUpComponent},
    {path: "contact",canActivate:[publicGuard], component: ContactComponent},


    //backoffice
    {
        path: "backoffice",canActivate:[authGuard],  component: LayoutComponent, children: [
            {path: "header-backoffice", component: HeaderBackofficeComponent},
            {path: "sidebar", component: SidebarComponent},
            {path: "conections", component: ConectionsComponent},
            {path: "user", component: UserComponent},
            {path: "project-options", component: ProjectOptionsSidebarComponent},
            {path: "note", component: NoteComponent },
            {path: "folder-panel", component: FolderPanelComponent}
        ]
    },

];

