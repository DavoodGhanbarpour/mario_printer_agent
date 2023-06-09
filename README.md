## Welcome to Mario Printer Agent.
------------

### What is it?
Well, the problem with web applications is that, they exists just in browsers and This means they don't have direct access to the clients resources. So imagine we have a Restaurant application that prints a preparation receipt after each order .As i mentioned applications don't have direct access to printer. Every printer request will executed by broweser itself and a printer dialog will shown which is not what clients wants! 
So we can solve this problem with many solutions. One of them is using a third-party application which is installed on clients machine and do this for us.

### How it works?
The general idea is that, The agent will try to call a webservice every 10 seconds. That will provide the address of a web page which we want to print. If there was any address provieded, so agent will catch that and shows it in a preview frame provided on itself, indicating that address is reachable and everything works fine. Then, provieded address will be printed by the printer which was provided in agent configurations. 

This was the general idea, but i encountered other challenges in the production. The problem was that restaurants can have many printers, And each printer may have its own unique print job. Imagine a restaurant have 2 section, one is the coffeeshop, the other is main section. When user submits an order including Mohito and Pizza, it should print Mohito at coffeshop's printer, and Pizza at restaurant's printer. Solution was easy, I changed the agent the way that user can selected mutli printer, and it will loop through all of them, calling the webservice with the name of printer device being sent to it.

#### Notice
For now, printer agnet supports only 80 mm size for POS printers.

#### Platform
- ElectornJS V?
- NodeJS V?
- Bootstrap V?



#### Installation
1. Just download it and run it. That's easy.

### ToDo

- [ ] Improvments in UI
    - [ ] Section for configurations
    - [ ] New title and icon
    - [ ] Selectable printer names
    - [ ] Tutorials
- [ ] A single installable file
- [ ] Startup option
- [ ] Support more printer size (A4, A5)

### Contribute
Any help would be apperciated.

