import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userData: any; // Dados do usuário

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      // Obtém o usuário autenticado
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;

        // Busca as informações no Firestore
        const userDoc = await this.firestore.collection('Usuários').doc(userId).get().toPromise();
        if (userDoc.exists) {
          this.userData = userDoc.data();
        } else {
          console.log('Usuário não encontrado no Firestore');
        }
      } else {
        console.log('Nenhum usuário autenticado');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
