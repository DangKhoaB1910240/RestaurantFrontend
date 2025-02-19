import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAdminComponent } from './nha-to-chuc-admin.component';

describe('CategoryAdminComponent', () => {
  let component: CategoryAdminComponent;
  let fixture: ComponentFixture<CategoryAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryAdminComponent]
    });
    fixture = TestBed.createComponent(CategoryAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
