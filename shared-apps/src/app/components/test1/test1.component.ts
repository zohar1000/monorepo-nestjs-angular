import { Component, OnInit } from '@angular/core';

interface a {
  title: string;
  name: string;
}

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss']
})
export class Test1Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
