import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../../../../common/toaster-service';
@Component({
  selector: 'app-redirect-to-android',
  templateUrl: './redirect-to-android.component.html',
  styleUrl: './redirect-to-android.component.scss'
})
export class RedirectToAndroidComponent implements OnInit {
  webURL: string = "";
  AppURL: string = "";
  token: string = "";
  constructor(private route: ActivatedRoute, private router: Router, private toaster: ToasterService) {
    this.webURL = environment.webUrl + "eonboard/";
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log(token); // This will log 'CA33470F0B1EDB4526FA7A0311D0D9A9'

    this.AppURL = "intent://reset?Token=" + token + "#Intent;scheme=myapp;package=com.teamopine.nirghosh;end";
    this.webURL = this.webURL + token;

    const isAndroid = /android/i.test(navigator.userAgent);

    if (isAndroid) {
      // Attempt to launch Android app via intent://
      window.location.href = this.AppURL;

      // Fallback after 2s to web page
      setTimeout(() => {
        this.router.navigateByUrl(this.webURL);
      }, 2000);
    } else {
      this.toaster.warningToaster("Please install the app from play store");
      // Non-Android fallback
      window.location.href = this.webURL;
    }
  }
}
