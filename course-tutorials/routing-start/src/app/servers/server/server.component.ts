import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  server: {id: number, name: string, status: string};

  constructor(
    private serversService: ServersService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Data) => {
          this.server = data['server'];
        }
      )

    // all of this works but was rendered redundant once we defined a resolver in our app-routing.module file
    // console.log('in ngoninit of server comp');
    // const id = +this.route.snapshot.params['id'];
    // this.server = this.serversService.getServer(id);
    // console.log(`in ngoninit of server comp and this.server is ${JSON.stringify(this.server)}`);
    // this.route.params
    //   .subscribe(
    //     (params: Params) => {
    //       this.server = this.serversService.getServer(+params['id']);
    //     }
    //   );
  }

  reloadRoute() {
    // this.router.navigate(['servers'], { relativeTo: this.route });
  }

  onEditServer(selectedId: number) {
    console.log(`selectedId = ${selectedId}`);
    let id = selectedId || this.server.id;
    // the following both before the same function, but is an absolute vs relative path
    // this.router.navigate(['/servers', id, 'edit']);
    this.router.navigate(['edit'],
      {
        relativeTo: this.route,
        queryParamsHandling: 'preserve'
      });
  }

}
