import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShowroomComponent } from './features/showroom/showroom.component';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { ArtistComponent } from './features/artist/artist.component';
import { EditProfileComponent } from './features/edit-profile/edit-profile.component';
import { AvailabilityComponent } from './features/availability/availability.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { authGuard } from './core/guards/auth.guard';
import { AppointmentComponent } from './features/appointments/appointment.component';
import { AppointmentDetailedComponent } from './features/appointments/appointment-detailed/appointment-detailed.component';
import { CheckoutSuccessComponent } from './features/checkout/checkout-success/checkout-success.component';
import { AdminComponent } from './features/admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { MessengerComponent } from './features/messenger/messenger.component';
import { EmailConfirmationComponent } from './features/account/confirmation/email-confirmation.component';
import { PasswordResetComponent } from './features/account/login/password-reset/password-reset.component';
import { PasswordResetConfirmComponent } from './features/account/login/password-reset-confirm/password-reset-confirm.component';
import { ReviewComponent } from './features/review/review.component';
import { ReviewSuccessComponent } from './features/review/review-success/review-success.component';
import { ArtistReviewsComponent } from './features/artist/artist-reviews/artist-reviews.component';
import { FaqComponent } from './features/faq/faq.component';
import { TermsComponent } from './features/legal/terms/terms.component';
import { PrivacyComponent } from './features/legal/privacy/privacy.component';
import { ContactComponent } from './features/legal/contact/contact.component';
import { ImprintComponent } from './features/legal/imprint/imprint.component';
import { VerifyArtistsComponent } from './features/admin/verify-artists/verify-artists.component';
import { FinancialsComponent } from './features/financials/financials.component';
import { RefreshComponent } from './features/financials/refresh/refresh.component';
import { ReturnComponent } from './features/financials/return/return.component';
import { artistGuard } from './core/guards/artist.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'showroom', component: ShowroomComponent },
    // { path: 'about-us', component: AboutUsComponent },
    { path: 'frequently-asked-questions', component: FaqComponent },

    { path: 'showroom/:id', component: ArtistComponent },
    { path: 'showroom/:id/reviews', component: ArtistReviewsComponent },
    { path: 'checkout/:id', component: CheckoutComponent, canActivate: [authGuard] },
    { path: 'checkout-success', component: CheckoutSuccessComponent, canActivate: [authGuard] },

    { path: 'review/success', component: ReviewSuccessComponent, canActivate: [authGuard] },
    { path: 'review/:id', component: ReviewComponent, canActivate: [authGuard] },

    { path: 'appointments', component: AppointmentComponent, canActivate: [authGuard] },
    { path: 'appointments/:id', component: AppointmentDetailedComponent, canActivate: [authGuard] },
    { path: 'edit-profile', component: EditProfileComponent, canActivate: [artistGuard] },
    { path: 'calendar', component: AvailabilityComponent, canActivate: [artistGuard] },
    { path: 'finance', component: FinancialsComponent, canActivate: [artistGuard] },
    { path: 'finance/refresh', component: RefreshComponent, canActivate: [artistGuard] },
    { path: 'finance/return', component: ReturnComponent, canActivate: [artistGuard] },
    { path: 'messenger', component: MessengerComponent, canActivate: [authGuard] },

    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'admin/verify-artists', component: VerifyArtistsComponent, canActivate: [adminGuard] },

    { path: 'account/login', component: LoginComponent },
    { path: 'account/password/reset', component: PasswordResetComponent },
    { path: 'account/password/reset/confirm', component: PasswordResetConfirmComponent },
    { path: 'account/register', component: RegisterComponent },
    { path: 'account/confirmation', component: EmailConfirmationComponent },

    { path: 'legal/terms', component: TermsComponent },
    { path: 'legal/imprint', component: ImprintComponent },
    { path: 'legal/privacy', component: PrivacyComponent },
    { path: 'legal/contact', component: ContactComponent },
    { path: 'not-found', component: NotFoundComponent },
    
    { path: 'server-error', component: ServerErrorComponent },
    { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
