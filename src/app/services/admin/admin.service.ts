import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, map, of, shareReplay } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  /** API url */
  private apiUrl = 'http://localhost:4000';

  /**
   * @param http HttpClient instance to make HTTP requests
   * @param supabase SupabaseService instance
   * @param toast MessageService instance to show toast messages
   */
  constructor(
    private http: HttpClient,
    private toast: MessageService,
  ) {}

}
