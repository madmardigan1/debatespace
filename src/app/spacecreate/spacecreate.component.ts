import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CardDataService, Card } from '../space-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spacecreate',
  templateUrl: './spacecreate.component.html',
  styleUrls: ['./spacecreate.component.css']
})
export class SpacecreateComponent implements AfterViewInit {
  form: FormGroup;
  cards: Card[] = [];
  @ViewChild('topicInput') topicInput!: ElementRef;
  constructor(private fb: FormBuilder, private cardService: CardDataService, private router: Router) {
    this.form = this.fb.group({
      topic: ['', Validators.required],
      description: ['', Validators.required],
      number: ['', Validators.required],
      entrancefee: []
     
  });

    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });
  }

  ngAfterViewInit() {
    this.topicInput.nativeElement.focus();
  }
  submit() {
    const formData = this.form.value;
    const id = Date.now().toString();
    this.cardService.addCard({ ...formData, id });
    this.router.navigate(['/debate', id]);
  }
}

