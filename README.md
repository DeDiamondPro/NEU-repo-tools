# NEU wiki links adder
 
This repository is made for a program I'm developing to automatically add (some) wiki links to the NEU json repo

To use:
- Create a folder repo
- put the updated repository in the folder repo
- create a folder info
- create a folder modified
- start index.js (with command prompt)

In the folder info it will show wich items it modified and wich it knows has no wiki link but couldn't do.
in the folder modified it will put all json files it modified.

# To easily verify the changes

I have also made a verifier to easily check if the changes made are correct (this is not automatic)

To use:
- create to-be-verified folder
- create verified folder
- put all changes in the to-be-verified folder (all files in modified folder from previous program)
- start index.js (with command prompt)
- connect to localhost:3000 in your browser
- press the refresh button to start off
- now if it is correct press yes and if it is not correct press no

all uncorect changes will be deleted
all correct changes will be moved to verified
