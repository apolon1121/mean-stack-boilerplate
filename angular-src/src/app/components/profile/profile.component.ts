import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    }, err => {
      console.log(err);
      return false;
    });
  }

  changeProfile() {
    const user = this.user;
    this.authService.changeProfile(user).subscribe(data => {
      console.log(data);
      if (data.status) {
        this.authService.updateUserData(data.user);
        this.flashMessage.show("Profile Updated!", { cssClass: 'alert', timeout: 3000 });
      } else {
        console.log("There was some problem!");
        this.flashMessage.show(data.message, { cssClass: 'alert alert-danger', timeout: 3000 });
      }
    });
  }

}
