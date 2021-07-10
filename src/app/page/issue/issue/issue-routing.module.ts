import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IssuePage } from './issue.page';

// authguard
import { AuthguardService } from 'src/app/shared/authguard/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: IssuePage
  },
  {
    path: 'issue-details',
    loadChildren: () => import('./issue-details/issue-details.module').then( m => m.IssueDetailsPageModule)
  },
  {
    path: 'issue-details/:id',
    loadChildren: () => import('./issue-details/issue-details.module').then( m => m.IssueDetailsPageModule)
  },
  {
    path: 'issue-details-linkage/:id',
    loadChildren: () => import('./issue-details/issue-details.module').then( m => m.IssueDetailsPageModule)
  },
  {
    path: 'issue-details-edit',
    loadChildren: () => import('./issue-details-edit/issue-details-edit.module').then( m => m.IssueDetailsEditPageModule)
  },
  {
    path: 'create-issue',
    loadChildren: () => import('./create-issue/create-issue.module').then( m => m.CreateIssuePageModule),
    canLoad: [AuthguardService],
    canActivate: [AuthguardService]
  },
    {
    path: 'comments',
    loadChildren: () => import('./issue-user-comments/issue-user-comments.module').then( m => m.IssueUserCommentsPageModule)
  },
  {
    path: 'send-email',
    loadChildren: () => import('../../send-email/send-email.module').then( m => m.SendEmailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssuePageRoutingModule {}
