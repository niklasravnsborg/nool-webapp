import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseAuth } from 'angularfire2';
import { Ng2UploaderModule } from 'ng2-uploader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: FirebaseAuth, public af: AngularFire) { }

  items: FirebaseListObservable<any[]>;
  user = {email: '', password: ''};
  newItem = '';
  loggedIn = false;

  uploadFile: any;
  hasBaseDropZoneOver: boolean = false;
  options: Object = {
    url: 'http://nool.niklasravnsborg.com/parse/'
  };
  sizeLimit = 2000000;

  ngOnInit() {
    this.auth.subscribe((user) => {
      if (user) {
        this.items = this.af.database.list('/messages');
        this.loggedIn = true;
      }
    });
  }

  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
      for (let message of data) {
        this.items.push(message);
      }

    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  beforeUpload(uploadingFile): void {
    if (uploadingFile.size > this.sizeLimit) {
      uploadingFile.setAbort();
      alert('File is too large');
    }
  }

  login() {
    this.auth.login(this.user, {
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    }).then((authData) => {
      // this.loader.dismiss();
      this.items = this.af.database.list('/messages');
      this.loggedIn = true;
    }).catch((error) => {
      console.log(error);
    });
  }

  addItem() {
    this.items.push({ course: this.newItem, type: 'canceled'});
    this.newItem = '';
  }

  removeItem(item) {
    console.log(item);
    this.items.remove(item);
  }

  logout() {
     this.af.auth.logout();
  }
}
