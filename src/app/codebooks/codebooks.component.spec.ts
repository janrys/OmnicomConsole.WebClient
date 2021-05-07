import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodebooksComponent } from './codebooks.component';

describe('CodebooksComponent', () => {
  let component: CodebooksComponent;
  let fixture: ComponentFixture<CodebooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodebooksComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodebooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
