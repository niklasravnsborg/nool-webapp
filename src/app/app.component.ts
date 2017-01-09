import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseAuth } from 'angularfire2';
import { Ng2UploaderModule } from 'ng2-uploader';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: FirebaseAuth, public af: AngularFire) { }

  items: FirebaseListObservable<any[]>;
  itemsPretty: Observable<any[]>;
  dates: Observable<any[]>;
  user = {email: '', password: ''};
  newItem = '';
  loggedIn = false;
  currentDate = '';

  uploadFile: any;
  hasBaseDropZoneOver: boolean = false;
  options: Object = {
    url: 'http://nool.niklasravnsborg.com/parse/'
  };
  sizeLimit = 2000000;

  ngOnInit() {

    this.auth.subscribe((user) => {
      if (user) {

        this.dates = new Observable(observer => {

          var dates = [];

          this.af.database.list('/messages', { preserveSnapshot: true }).subscribe(messages => {

            messages.forEach(message => {

              var date = moment(message.val()['date']).format('DD.MM.YYYY');

              if (dates.indexOf(date) === -1) {
                dates.push(date);
              }

              this.currentDate = date;

            });
            observer.next(dates);

          });
        });



        this.itemsPretty = new Observable(observer => {

          this.af.database.list('/messages', { preserveSnapshot: true }).subscribe(messages => {

            var messagesArray = [];

            messages.forEach(message => {
              var date = moment(message.val()['date']).format('DD.MM.YYYY');
              var object = message.val();
              object['prettyDate'] = date;
              object['$key'] = message.key;
              messagesArray.push(object);

            });

            observer.next(messagesArray);

          });

        });

        this.items = this.af.database.list('/messages');
        this.loggedIn = true;
      }
    });
  }

  clickUpload() {
    document.getElementById('file-import').click()
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
