import { Component, OnInit } from '@angular/core';
import { ServersService } from '../servers.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  allowEdit = false;
  changesSaved = false;

  constructor(
    private serversService: ServersService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // this will only be up-to-date when we navigate to this route from another route
    console.log(this.route.snapshot.queryParams);
    console.log(this.route.snapshot.fragment);

    // this allows us to receive updated props when we navigate to this route from within this route
    // i.e. - when we're already on this route but we change the params or fragment
    this.route.queryParams
      .subscribe(
        (queryParams: Params) => {
          console.log('queryparams are ' + JSON.stringify(queryParams));
          this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
        }
    );
    this.route.fragment.subscribe(
      (fragment: string) => {
        console.log(fragment);
      }
    );

    this.server = this.serversService.getServer(1);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onNavigateAgain(id: number) {
    this.router.navigate(['/servers', id, 'edit'],
      {
        queryParams: { allowEdit: '9' },
        fragment: 'monkey'
      }
    );
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.allowEdit) {
      return false;
    }
    if ((this.serverName !== this.server.name || this.serverStatus !== this.server.status)
      && !this.changesSaved) {
      return confirm('do you want to discard changes?');
    } else {
      return true;
    }
    
  }

}
