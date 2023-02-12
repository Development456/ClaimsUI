import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleassignmentComponent } from './roleassignment.component';

describe('RoleassignmentComponent', () => {
  let component: RoleassignmentComponent;
  let fixture: ComponentFixture<RoleassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleassignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
