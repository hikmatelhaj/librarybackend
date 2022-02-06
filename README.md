# Project Frameworks voor serverapplicaties - Group 6



**Webapplicatie:** 

Op deze URL kan je boeken huren en terugbrengen: http://193.191.169.111:3000/huren

Om boeken te huren moet je de beschikbare boeken weten, die kan je vinden op deze URL: http://193.191.169.111:3000/huren/beschikbare-boeken

Wanneer een client het formulier op de huur pagina invult (en ok klikt op de alert), dan zullen alle clients die verbonden zijn met de beschikbare boeken pagina automatisch gerefresht worden. Indien het formulier correct is ingevuld en geen strijdige informatie bevat (zoals een onbestaand ISBN nummer), dan zal je een aanpassing zien in de beschikbaarheid op de beschikbare boeken pagina.

**REST API**

Je kan de REST service bereiken op de link: http://193.191.169.111:3000/

* **GET /huren/beschikbare-boeken/alle-boeken** | Hiermee kan je een overzicht krijgen van alle boeken. Een boek heeft een relatie met een persoon (**ManyToOne**) die **eager** is. In het overzicht zal je alle personen zien. Deze REST service is geïmplementeerd in de webapplicatie en wordt gebruikt in boek.js om een dynamisch overzicht van alle boeken weer te geven.
* **POST /admin/boek-toevoegen** | Dit voegt een boek toe, hieronder vind je een voorbeeld van een body: Let op! Een nieuw ISBN nummer is nodig want alle ISBN nummers zijn uniek (UNIQUE constraint). Indien dit niet wordt nageleefd, dan wordt er een 406 error gereturned.

````
{
        "titel": "De liefdesbrief",
        "taal": "nl",
        "jaar": 2021,
        "isbn_nummer": "9789401615631",
        "voornaam_auteur": "Lucinda",
        "achternaam_auteur": "Riley",
        "uitgever": "Xander Uitgevers B.V",
        "genrenaam": ["Liefde", "Roman"]
}
````

* **POST /admin/boeken-toevoegen** | Met deze REST service kan je een verzameling van boeken toevoegen, hieronder vind je een voorbeeld van een body. Let op, het ISBN nummer moet uniek zijn. Indien dit niet wordt nageleefd, dan wordt er een 406 error gereturned.

  ````
  [{
          "titel": "De liefdesbrief_versie_1",
          "taal": "nl",
          "jaar": 2021,
          "isbn_nummer": "9789401615632",
          "voornaam_auteur": "Lucinda",
          "achternaam_auteur": "Riley",
          "uitgever": "Xander Uitgevers B.V",
          "genrenaam": ["Liefde", "Roman"]
  }, 
  {
          "titel": "De liefdesbrief_versie_2",
          "taal": "nl",
          "jaar": 2021,
          "isbn_nummer": "9789401615633",
          "voornaam_auteur": "Lucinda",
          "achternaam_auteur": "Riley",
          "uitgever": "Xander Uitgevers B.V",
          "genrenaam": ["Liefde", "Roman"]
  }]
  ````

* **GET /admin/:id** | Een boek krijgen met een opgegeven id bv: http://193.191.169.111:3000/admin/1
* **DELETE /admin/:id** | Een boek verwijderen met een opgegeven id bv: http://193.191.169.111:3000/admin/1

* **GET /cd/cds-without-genres** | Een cd heeft net zoals een boek een **ManyToMany** relatie met een genre. De relatie is **lazy** en wordt geïmplementeerd met een promise. In het antwoord kan je zien dat er geen genres worden getoond omdat het genrenaam niet expliciet is opgevraagd. 

* **GET /cd/cds-with-genres** | In het antwoord kan je zien dat er wel genres worden getoond omdat dit expliciet is opgevraagd met een await statement op de genrenaam.

  ````
  const genres = await cds[i].genrenaam;
  ````

* **GET /persoonbeheer/bibkaarten** | Met deze REST service kan je een overzicht zien van alle bibkaarten. Een persoon heeft een **OneToOne** relatie met een bibkaart in **cascade**. In de webapplicatie kan je een boek huren/terugbrengen waarbij je een persoonsnaam en email moet geven. Indien die persoon nog niet bestaat in de database, dan zal er een nieuw persoon aangemaakt worden. Dit gebeurt in cascade, de bibkaart zal dan automatisch in de database opgeslagen worden zonder een externe save te gebruiken. Je kan dit testen om als een nieuw persoon een boek te huren (zie webapplicatie) en nadien te kijken met deze REST service of er een bibkaart is bijgekomen.

  ![formulier](https://i.imgur.com/8uRREDh.png)

* **PUT /persoonbeheer/bibkaart/:id** | Deze REST service zorgt ervoor dat een bibkaart aangepast wordt, bv een PUT naar deze link (http://193.191.169.111:3000/persoonbeheer/bibkaart/1) met onderstaande body wijzigt de barcode van een bibkaart met id 1.

  ````
  {
  	"barcode": "11603549"
  }
  ````



In de datalaag is er een abstracte klasse 'Item' waarvan de entiteit klasse en cd van afgeleid zijn. De REST services maken gebruik van een DAO object.

Overal is er foutafhandeling toegevoegd aan de hand van try en catch zodat de applicatie zonder interrupties kan runnen.

Een voorbeeld waar **geen cascade** is geïmplementeerd is bv. bij een boek toevoegen. De persoon en genres worden niet direct opgeslagen in cascade. 

