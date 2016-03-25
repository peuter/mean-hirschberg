## TODOS:

* Frontend für Events + Clubs fertigstellen
* Kalender mit Events anzeigen
* Backend + Frontend für News + Push Nachrichten
* Frontend für Verknüpfungen / Rollen zwischen Personen und Vereinen
* Auth über Social (Facebook, Twitter, usw.)
* Synchronisation Typo3-DB <-> MongoDB für Events, Clubs, Personen, User
  (Daten an beiden Stellen änderbar machen, 
  * Typo3-Hooks die Änderungen zur Rest-API weiterleiten
  * Hooks in die Rest-Api einbauen, die Änderungen an Typo3-DB übertragen
  * Prüfen ob Typo3 auch eine Rest-API hat, macht die Sache ggf. einfacher


## APP
* Je nach User-Rolle unterschiedliche Funktionen:
* Gast (jeder ohne Login):
  * Registrierung
  * Vereine browsen, Termine einsehen, News ansehen
* Club-Follower:
  * Push Benachrichtigungen für News / Events / Messages vom Verein
  * Auto-Sync mit Kalender (Events)
* Club-Admins (ggf. Beschränken auf 2, können nur vom Root ausgewählt werden):
  * News / Events / Messages für Verein und alle Untergruppen erstellen
  * Club-Mods aus den Followern (de-)aktivieren
  * Vereins-Untergruppen erstellen (z.B. Vorstand, Mitglieder, usw.)
  * Club-Mods den Untergruppen zuordnen
 * Club-Mods (keine Einschränkungen in der Menge)
  * News / Events / Messages für alle Untergruppen denen sie zugeordnet sind
* End-to-End Verschlüsselung???
  
### Push-Nachrichten
* Titel, Content (Zeichenbeschränkung), Bild

### Vereins-Nachrichten
* Titel, Content, Attachment, Url

### Misc
* Veranstaltungskalender automatisch aus Terminen generieren
* Termine mit wiederholung anlegen (auch rel. abh. von Ostern, z.B. Pfingsten 50 Tage nach Ostern)
* Individuelle Benachrichtigungen für Termin-Kategorien einstellen (z.B. Entsorgungstermine 22 Uhr am Tag vorher)
* PrimeNG scheduler als Kalender

```
# build code
$ npm run build

# start up the stack

# this command runs two commands in parallel via `concurrently`:
# `npm run server` starts up `webpack-dev-server` allowing for
# hot module reloading
# `npm` run watch` uses `webpack` to watch the necessary files
# and build on file change
$ npm start

# in a separate terminal:
# start `Express` server
$ gulp serve
```