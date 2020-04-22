/*l'integralité du code Java script a etait fait pour fonctionner peut importe la page web 
sur le quel on le met il contient donc les different button duu menu.
Les sauvegarde sont gerer automatiquement et sont supprimer a la fin de la parti */

//initialisation de la class grille
function grille(i,j){
	this.array= new Array(i*j);
	for(var n = 0;n<i*j;n++){
		this.array[n]="";
	}
	this.ligne=i;
	this.colone=j;
	this.numJoueur=1;
	this.end=0;// 1 si parti fini
	this.namesave=-1
}



//fonction utilitaire======================================================================
//renvoie la cellule de coordonnée (i,j)
grille.prototype.cell = function(i,j){
	return this.array[this.posToId(i,j)];
}
//position (i,j) a idpos
grille.prototype.posToId = function(i,j){
	return i*(this.colone)+j;
}
//modifie la celule (i,j)
grille.prototype.modifcell = function(i,j,value){
	this.array[i*(this.colone)+j]=value;
}
//fin des fonction utilitaire===============================================================




//fonction de test placement libre n'est pas appeler dans le puissance 4 mais nous a permis de tester different scenario(a la place de jouer)
grille.prototype.testjouer =function(i,j){
	console.log(i+"-"+j+" cell: "+this.cell(i,j));
	if(this.numJoueur==1){
			this.modifcell(i,j,"X");
			this.numJoueur=2;
		}
		else{
			this.modifcell(i,j,"O");
			this.numJoueur=1;
		}
		document.getElementById(this.posToId(i,j)).innerHTML=this.cell(i,j);
		this.verif(i,j);
	return 0;

}



//fonction qui gere la parti ===============================================================
//joue le pion du joueur j
grille.prototype.jouer = function(j){
	if(this.end==0){
		var i=this.ligne-1;
		while(i>=0 && this.cell(i,j)!=""){
			i-=1;
		}
		if(i>=0){
			if(this.numJoueur==1){
				this.modifcell(i,j,"X");
				this.numJoueur=2;
			}
			else{
				this.modifcell(i,j,"O");
				this.numJoueur=1;
			}
			var cell = document.getElementById(this.posToId(i,j))
			if (this.cell(i,j)=="X"){cell.style="border-radius: 50%;box-shadow: inset 0 0  30px black;  background-color: #B22222;"}
			if (this.cell(i,j)=="O"){cell.style="border-radius: 50%;box-shadow: inset 0 0  30px black; background-color:yellow ;"}
			afficheinformation(this.numJoueur);
			this.verif(i,j);
		}

		return 0;
	}
}

//verification de l'alignement des pion
grille.prototype.verif =function(i,j){
	var compteurAligner = function(istart,jstart,pasi,pasj,obj){
		var compteurO=0;
		var compteurX=0;
		var i=istart;
		var j=jstart;
		while((i>=0 && i<obj.ligne) && (j>=0 && j<obj.colone)){
			//console.log("cell:" + obj.cell(i,j) + "i:" + i + "j:"+ j);
			if(obj.cell(i,j)=="O"){
				compteurO++;
				compteurX=0;
			}
			else if(obj.cell(i,j)=="X"){
				compteurX++;
				compteurO=0;
			}
			else{
				compteurX=0;
				compteurO=0;
			}
			//si le joueur O a gagner
			if(compteurO>=4){
				/*si premiere fois qu'il arrive ici (cas ou il finit avec 
				2 trait qui ce croisent en un même point cela permet de
				 mettre en sur brilance les 2 sans update 2 fois le score et la sauvegarde)*/
				if(obj.end==0){
					updatescore(2);
					//si il a une sauvegarde on la supprime.
					if(obj.namesave!=-1){
						var saveList = JSON.parse(localStorage.getItem("saveList"));
						saveList.splice(saveList.indexOf(obj.namesave),1);
						localStorage.setItem("saveList",JSON.stringify(saveList));
						localStorage.removeItem(obj.namesave);
						obj.namesave=-1;
					}
				}
				document.getElementById("information").innerHTML="Le joueur Jaune a gagné.";
				//console.log("Joueur jaune gagne");
				obj.end=1;
				var i2=i;
				var j2=j;
				for(var n=0;n<compteurO;n++){
					var td = document.getElementById(obj.posToId(i2,j2));
					td.style="border-radius: 50%;box-shadow:inset 0 0  30px black, 0 0 30px 10px #FFFFE0; background-color:#FFD700 ;";
					i2=i2-pasi;
					j2=j2-pasj;
				}
			}
			//si le joueur X a gagner (meme fonctionnement que precedament)
			else if(compteurX>=4){
				//si premiere fois qu'il arrive ici
				if(obj.end==0){
					updatescore(1);
					//si il a une sauvegarde on la supprime
					if(obj.namesave!=-1){
						var saveList = JSON.parse(localStorage.getItem("saveList"));
						saveList.splice(saveList.indexOf(obj.namesave),1);
						localStorage.setItem("saveList",JSON.stringify(saveList));
						localStorage.removeItem(obj.namesave);
						obj.namesave=-1;
					}
				}

				document.getElementById("information").innerHTML="Le joueur Rouge a gagné.";
				//console.log("Joueur rouge gagne");
				obj.end=1;
				//mise en valeur de tout les element afficher
				var i2=i;
				var j2=j;
				for(var n=0;n<compteurX;n++){
					var td = document.getElementById(obj.posToId(i2,j2));
					td.style="border-radius: 50%;box-shadow: inset 0 0  30px black, 0 0 30px 10px #FFFFE0;  background-color: #8B0000;";
					i2=i2-pasi;
					j2=j2-pasj;
				}
			}
			j+=pasj;
			i+=pasi;
		}
	}
	if(this.end==0){
		//Vertical
		compteurAligner(i,0,0,1,this);

		//Horizontal
		compteurAligner(i,j,1,0,this);
		//diagonal -i+j
		icopy=i;
		jcopy=j;
		while(icopy< this.ligne-1 && jcopy>0){icopy+=1; jcopy-=1;}
		compteurAligner(icopy,jcopy,-1,1,this);

		//diagonal i+j
		icopy=i;
		jcopy=j;
		while(icopy>0 && jcopy>0){icopy-=1; jcopy-=1;}
		compteurAligner(icopy,jcopy,1,1,this);
		//match null
		var j=0;
		while(j<this.colone && this.cell(0,j)!=""){
			j++;
		}
		if(this.cell(0,j)!=""){
			this.end=1;
			document.getElementById("information").innerHTML="Match null.";
			//console.log("match null");
			updatescore(0);
			//si il a une sauvegarde, elle est supprimer
			if(this.namesave!=-1){
				var saveList = JSON.parse(localStorage.getItem("saveList"));
				saveList.splice(saveList.indexof(this.namesave),1);
				localStorage.setItem("saveList",JSON.stringify(saveList));
				localStorage.removeItem(this.namesave);
				obj.namesave=-1;
			}
		}
	}
}
//fin fonction qui gere la parti ===============================================================




//met a jour les scores
function updatescore(gagnant){
	var scorej1=localStorage.getItem("scorej1");
	var scorej2=localStorage.getItem("scorej2");
	var nbparti=localStorage.getItem("nbparti");
	if(scorej1==null){scorej1=0;}
	else{scorej1=parseInt(scorej1);}
	if(scorej2==null){scorej2=0;}
	else{scorej2=parseInt(scorej2);}
	if(nbparti==null){nbparti=0;}
	else{nbparti=parseInt(nbparti);}
	if(gagnant==2){scorej2=scorej2+1;}
	if(gagnant==1){scorej1=scorej1+1;}
	nbparti+=1;
	localStorage.setItem("scorej1",scorej1);
	localStorage.setItem("scorej2",scorej2);
	localStorage.setItem("nbparti",nbparti);
	affichescore();
}

//debut des fonction d'affichage des divers element============================================================

//affichage de la grille + action du click sur une cellule rediriger a la fonction jouer
grille.prototype.affiche = function(){
	var ClickHandler = function(cell,obj) { //action du click
        	return function() { 
                var id = cell.id;;
                //obj.testjouer(parseInt(id/obj.colone),id%obj.colone);
                obj.jouer(id%obj.colone);
            };
         };
	var div = document.createElement("div");
	div.id="Puissance4";
	document.body.appendChild(div);
	var Table = document.createElement("table");
	Table.id="grillejeu";
	Table.border=2;
	//Table.style="text-align:center;background-color:blue";
	var Tbody = document.createElement("tbody");

	for(var i = 0;i<this.ligne;i++){
		var tr = document.createElement("tr");
		for(var j=0;j<this.colone;j++){
			var td= document.createElement("td");
			td.width=70;
			td.height=70;
			td.id=i*(this.colone)+j;
			td.onclick=ClickHandler(td,this);
			if (this.cell(i,j)=="X"){td.style="border-radius: 50%;box-shadow: inset 0 0  20px black;  background-color: #B22222;"}
			if (this.cell(i,j)=="O"){td.style="border-radius: 50%;box-shadow: inset 0 0  20px black; background-color:yellow;"}
			if (this.cell(i,j)==""){td.style="border-radius: 50% ;background-image: url(boisS.jpg);box-shadow: inset 0 0  5px black;"}
			tr.appendChild(td);
		}
		Tbody.appendChild(tr);
	}
	Table.appendChild(Tbody);
	document.getElementById("Puissance4").appendChild(Table);
	var info = document.createElement("p");
	info.id="information";
	document.getElementById("Puissance4").appendChild(info);

	this.setButton();
	setupscoretable();
	affichescore();
	afficheinformation(this.numJoueur,this.end);
}

function setupscoretable(){
	//tableau des score========================================================
	var infoscore = document.createElement("table");
	infoscore.id="infoscore";
	infoscore.style="border-collapse: collapse;"
	var title = document.createElement("caption");
	title.style="color:white";
	title.appendChild(document.createTextNode("Score des jeux"));
	var trrouge=document.createElement("tr");
	var trjaune=document.createElement("tr");
	var trtotale=document.createElement("tr");
	var tdnamerouge = document.createElement("td");
	tdnamerouge.appendChild(document.createTextNode("Rouge"));
	var tdnamejaune = document.createElement("td");
	tdnamejaune.appendChild(document.createTextNode("Jaune"));
	var tdscorerouge = document.createElement("td");
	tdscorerouge.id="scorerouge";
	var tdscorejaune = document.createElement("td");
	tdscorejaune.id="scorejaune";
	var tdnameparti = document.createElement("td");
	tdnameparti.appendChild(document.createTextNode("Nombre de parties jouées"));
	var tdnbparti = document.createElement("td");
	tdnbparti.id="nbparti";

	infoscore.appendChild(title);
	trrouge.appendChild(tdnamerouge);
	trrouge.appendChild(tdscorerouge);
	infoscore.appendChild(trrouge);
	trjaune.appendChild(tdnamejaune);
	trjaune.appendChild(tdscorejaune);
	infoscore.appendChild(trjaune);;
	trtotale.appendChild(tdnameparti);
	trtotale.appendChild(tdnbparti);
	infoscore.appendChild(trtotale);
	document.getElementById("Puissance4").appendChild(infoscore);
	//fin de l'initialisation du tableau des score==============================
}

//affiche les score sur le tableau des score
function affichescore(){
	var scorej1=localStorage.getItem("scorej1");
	var scorej2=localStorage.getItem("scorej2");
	var nbparti=localStorage.getItem("nbparti");
	if(scorej1==null){scorej1=0;}
	if(scorej2==null){scorej2=0;}
	if(nbparti==null){nbparti=0;}
	document.getElementById("scorerouge").innerHTML=scorej1;
	document.getElementById("scorejaune").innerHTML=scorej2;
	document.getElementById("nbparti").innerHTML=nbparti;
}




//affiche la personne qui dois jouer
function afficheinformation(numjoueur){
	var info=document.getElementById("information");
	if (numjoueur==1){var player = "Au tour du joueur Rouge.";}
	else{var player = "Au tour du joueur Jaune.";}
	info.innerHTML=player

}




//ajout et parametrage des boutton du menu================================================================

//boutton de sauvegarde
grille.prototype.save= function(){
	//si la parti n'est pas finit possibiliter de sauvegarder
	if(this.end==0){
		var gameselect=document.getElementById("saveSelect").value;
		//si la parti n'est pas sauvegarder
		if(this.namesave==-1){
			var saveList = JSON.parse(localStorage.getItem("saveList"));
			if (saveList==null){
				this.namesave=0;
				var i = 0;
				saveList=[0]
				localStorage.setItem("saveList",JSON.stringify(saveList));
			}
			else{
				var i=0;
				//cherche un numero sans sauvegarde
				while(i<saveList.length && saveList.indexOf(i)!=-1){
					i++;
				}
				//si un indice est libre au milieux du tableau
				if(saveList.indexOf(i)==-1){
					this.namesave=i;
					saveList.splice(i,0,i);
				}
				//sinon rajouter a la fin
				else{
					i=i+1;
					this.namesave=i;
					saveList.splice(i,0,i);
				}
				localStorage.setItem("saveList",JSON.stringify(saveList));
			}
			localStorage.setItem(this.namesave, JSON.stringify(this));
			var select=document.getElementById("saveSelect");
			var option=document.createElement("option");
			option.value=saveList[i];
			option.appendChild(document.createTextNode("Partie actuelle: "+saveList[i]));
			select.appendChild(option);
		}
		//si la parti a deja une sauvegarde
		else{
			localStorage.setItem(this.namesave, JSON.stringify(this));
		}
	}
}


//creation d'une nouvelle parti
function newGame(obj){
	delete obj;
	var element = document.getElementById("Puissance4");
	element.parentNode.removeChild(element);
	setup(-1);
}
//charge la parti selectionné
function charger(obj){
	var gameselect=document.getElementById("saveSelect").value;
	if(gameselect!=""){
		delete obj;
		var element = document.getElementById("Puissance4");
		element.parentNode.removeChild(element);
		setup(parseInt(gameselect));
	}
}

grille.prototype.setButton = function(){
	//boutton save
	function save(obj){return function(){obj.save();}}
	var div = document.getElementById("Puissance4");
	var savebutton = document.createElement("button");
	savebutton.id="buttonS";
	var savenode = document.createTextNode("Sauvegarder");
	savebutton.onclick=save(this);
	savebutton.appendChild(savenode);
	div.appendChild(savebutton);
	//boutton new game
	function restart(obj){return function(){newGame(obj);}}
	var restartbutton = document.createElement("button");
	restartbutton.id="buttonNG";
	var restartnode = document.createTextNode("Nouvelle partie");
	restartbutton.onclick=restart(this);
	restartbutton.appendChild(restartnode);
	div.appendChild(restartbutton);
	//boutton reset score
	function resetsc(){return function(){
		localStorage.setItem("scorej1",0);
		localStorage.setItem("scorej2",0);
		localStorage.setItem("nbparti",0);
		affichescore();}}
	var resetscore = document.createElement("button");
	resetscore.id="buttonRS";
	var resetnode = document.createTextNode("Réinitialiser le score");
	resetscore.onclick=resetsc();
	resetscore.appendChild(resetnode);
	div.appendChild(resetscore);
	//selection des sauvegarde
	var saveList = JSON.parse(localStorage.getItem("saveList"));
	var select = document.createElement("select");
	select.id="saveSelect";
	var option=document.createElement("option");
	option.value="";
	option.appendChild(document.createTextNode("Choisir une sauvegarde"));
	select.appendChild(option);
	if(saveList!=null){
	for(i=0;i<saveList.length;i++){
		var option=document.createElement("option");
		option.value=saveList[i];
		if(saveList[i]==this.namesave){option.appendChild(document.createTextNode("Partie actuelle : "+saveList[i]));}
		else{option.appendChild(document.createTextNode("Partie : "+saveList[i]));}
		select.appendChild(option);
	}}
	div.appendChild(select);
	//charger la sauvegarde
	function charg(obj){return function(){charger(obj);}}
	var chargebutton = document.createElement("button");
	chargebutton.id="buttonC";
	var chargenode = document.createTextNode("OK");
	chargebutton.onclick=charg(this);
	chargebutton.appendChild(chargenode);
	div.appendChild(chargebutton);

}
//fin boutton menu============================================================================================================



//fonction principale qui lance une parti
function setup(parti){
	var saveList = JSON.parse(localStorage.getItem("saveList"));
	if(parti!=-1 && localStorage.getItem("saveList")!=null && saveList.indexOf(parti)!=-1){
		var gameselect=parti;
		if(localStorage.getItem(gameselect)!=null){
			var puissance4= JSON.parse(localStorage.getItem(gameselect));
			puissance4.__proto__ = grille.prototype;
		}
	}
	else{
	var puissance4 = new grille(6,7);}
	puissance4.affiche();
}
