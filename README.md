# accelerant - POC AntiBot
Proof of concept antibot solution which evaluates metrics from users' browser to return a trust score on how likely the user is a bot.
This project uses NodeJS, Python, Flask, MongoDB, 

Uses multiple techniques including browser metric evaluation, IP address checking, mouse movement evaluation, proof of work analysis. 

Proof-Of-Work tasks increases the computational power required for any large website scraping to take place.

## Further To-Do List / Potential for Improvement

AI based mouse movement evaluation

TLS connection evaluation (Flask does not support inspection of the low level TLS handshake, so this would require a different webserver(or perhaps even language) to be used.


## SENSITIVE DATA DISCLOSURE
Database credentials are included in this code, as this was a private repository which I have now made public since I am no longer actively developing this.
These credentials have been revoked and cannot be used.
