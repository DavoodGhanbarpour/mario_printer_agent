## Welcome to Mario Printer Agent.
------------

### What is it?
The issue with web applications is that they exist solely within browsers. This means they lack direct access to client resources. Consider a restaurant application that prints a preparation receipt after each order. As mentioned, applications lack direct printer access. Every printer request is executed by the browser itself, prompting a printer dialog, which may not align with the client's preferences. 
To solve this, we can employ various solutions, one of which involves utilizing a third-party application installed on the client's machine.

### How it works?
The general idea is that the agent attempts to call a web service every 10 seconds. This service provides the address of a webpage to print. If an address is provided, the agent captures it and displays it in a preview frame within itself, indicating that the address is reachable and everything is functioning correctly. Subsequently, the provided address is printed by the printer configured within the agent. 

While this was the initial concept, I encountered other challenges in production. Restaurants may have multiple printers, each designated for specific print jobs. For instance, imagine a restaurant with two sections: a coffee shop and the main dining area. When a user submits an order containing a Mojito and a Pizza, the Mojito should print at the coffee shop's printer, and the Pizza at the main section's printer. The solution was straightforward: I modified the agent to allow users to select multiple printers, and it iterates through each one, calling the web service with the respective printer device name.

#### Notice
Currently, the printer agent supports only 80 mm paper size for POS printers.

#### Platform
- ElectronJS: [Version]
- NodeJS: [Version]
- Bootstrap: [Version]

#### Installation
1. Simply download and run it. It's that easy.

### ToDo

- [ ] UI Improvements
    - [ ] Configuration section
    - [ ] New title and icon
    - [ ] Selectable printer names
    - [ ] Tutorials
- [ ] Create a single installable file
- [ ] Implement startup option
- [ ] Support for additional printer sizes (A4, A5)

### Contribute
Any help would be appreciated.
