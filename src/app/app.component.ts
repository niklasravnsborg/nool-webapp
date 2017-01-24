import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods, FirebaseAuth } from 'angularfire2';
import { Ng2UploaderModule } from 'ng2-uploader';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take'
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: FirebaseAuth, public af: AngularFire) { }

  items: FirebaseListObservable<any[]>;
  itemsPretty = [];
  dates = [];
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

        this.af.database.list('/messages', { preserveSnapshot: true }).subscribe(messages => {

          var itemsPretty = [],
              dates = [];

          messages.forEach(message => {

            var object = message.val(),
                date   = moment(message.val()['date']).format('DD.MM.YYYY');

            object['prettyDate'] = date;
            object['$key'] = message.key;

            itemsPretty.push(object);

            if (dates.indexOf(date) === -1) {
              dates.push(date);
            }

            this.currentDate = date;

          });

          this.itemsPretty = itemsPretty;
          this.dates = dates;

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

      this.af.database.list('/messages').take(1).subscribe((messages) => {
        // this logic handles that a message can only be imported and exist once
        messages.forEach((message) => {
          data.forEach((newMessage, i) => {
            if (
              newMessage.course === message.course &&
              newMessage.date   === message.date &&
              newMessage.lesson === message.lesson &&
              newMessage.type   === message.type
            ) {
              // delete data from the importing array if this message exists already
              data.splice(i, 1);
            }
          });
        });

        // import / push the remaining data to the realtime db
        data.forEach(message => {
          this.items.push(message);
          // console.log(message);
        });

      });

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
