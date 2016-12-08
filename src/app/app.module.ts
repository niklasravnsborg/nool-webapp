import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { Ng2UploaderModule } from 'ng2-uploader';

import { AppComponent } from './app.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyB6BmmDaCCC0UEWQ_yqfvojXIeOFOxM3J0',
  authDomain: 'nool-b1267.firebaseapp.com',
  databaseURL: 'https://nool-b1267.firebaseio.com',
  storageBucket: 'nool-b1267.appspot.com'
};

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Redirect
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Ng2UploaderModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
