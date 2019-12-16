import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LakimHeaderComponent } from './lakim-header.component';

describe('LakimHeaderComponent', () => {
  let component: LakimHeaderComponent;
  let fixture: ComponentFixture<LakimHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LakimHeaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LakimHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should scheduleAppointment', () => {
    expect(component).toBeTruthy();
  });
});
