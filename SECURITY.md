# yeeturl Security

*Some things in this file that are not entirely related to security were omitted in order to make sure it would be easy to understand.*

## How it Works

**Shortening of URLs**

- A 10-character password is generated (which is used for encryption),
- the provided URL is encrypted using [sjcl](https://bitwiseshiftleft.github.io/sjcl/). The password which was previously generated is hashed using PBKDF2 with 275,000 iterations first to slow down brute-force attacks,
- the encrypted URL is sent to our server.

- Our server generates a random, 6-character ID for the URL,
- your data is saved to a database,
- the plaintext ID is sent back to the client.

- The website displays the short URL. That URL consists of the plaintext ID and password, however, [these are not sent to the server](https://stackoverflow.com/a/14462350).

**Redirecting short URLs**

- A request for the encrypted data is made to our server,
- our webserver retrieves the encrypted URL from our database and sends it back to the client,
- the encrypted link is automatically decrypted; the password was already provided inside the short link,
- the long (previously shortened) URL is sanitized (to prevent injection of HTML) and displayed to the user. The user can now decide whether they want to get redirected or not.

## Security Principles

This is a set of requirements the developer has to follow before submitting code into this respository.

- Keep things automatic and seamless: the majority of the world wants things to "just work".
- Never send the URL or password in plaintext: the server shouldn't be ever allowed to read the user's links, for any purpose.
- Write simple, maintainable code: keeping things simple makes the code less prone to major security vulnerabilities.
- Think of any ways your code could be exploited.
- If possible, do things on the client side.

## Security for administrators

We do everything in our power to keep your instance from being exploited, as that would be a disaster for our public instance too. yeeturl can run with very little privileges and read-only filesystem access.

## For end-users: how yeeturl protects your links in case of a data breach
Because yeeturl encrypts your links, attackers can't do much (if anything) with the data. This isn't an excuse for server admins to use poorly secured databases though.

## Discovered vulnerabilities

- none yet
