import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LocalStorageService {
  subjects: { [key: string]: BehaviorSubject<any> } = {};

  constructor() {
    window.addEventListener('storage', (event: StorageEvent) => {
      console.log(event);
      const key = event?.key;
      if (key && this.subjects[key]) {
        this.subjects[key].next(event.newValue);
      }
    });
  }

  getSubject<T>(key: string): BehaviorSubject<T> {
    if (!this.subjects[key]) {
      this.subjects[key] = new BehaviorSubject<T | null>(this.get<T>(key));
    }
    return this.subjects[key];
  }

  get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
    this.subjects[key]?.next(value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
    this.subjects[key]?.next(null);
  }
}
