# Convert OVH text to DNS bind file

Put your ovh text into `input.txt` and add your domain name as the first line.
Example:
```
my-domain.example
$TTL 3600
@	IN SOA dns16.ovh.net. tech.ovh.net. (2023100600 86400 3600 3600000 60)
                          IN NS     ns16.ovh.net.
                          IN NS     dns16.ovh.net.
                          IN MX     1 mail.my-domain.example.
                       60 IN A      1.2.3.4
                      600 IN TXT    "v=spf1 include:mail.my-domain.example ~all"
                          IN TXT    "1|www.my-domain.example"
_autodiscover._tcp        IN SRV    0 0 443 mail.my-domain.example.
_dmarc                    IN TXT    "v=DMARC1; p=quarantine; sp=quarantine"
_imaps._tcp               IN SRV    0 0 993 mail.my-domain.example.
api                    60 IN A      1.2.3.4
autoconfig                IN CNAME  mail.my-domain.example.
```

Execute `node convert.js` and you get a DNS bind file with your domain name (`my-domain.example.bind`):

```
;NS records
my-domain.example.	IN	5m	NS	ns16.ovh.net.
my-domain.example.	IN	5m	NS	dns16.ovh.net.

;MX records
my-domain.example.	IN	5m	MX	1 mail.my-domain.example.

;A records
my-domain.example.	IN	5m	A	1.2.3.4
api.my-domain.example.	IN	5m	A	1.2.3.4

;TXT records
my-domain.example.	IN	5m	TXT	"v=spf1 include:mail.my-domain.example ~all"
my-domain.example.	IN	5m	TXT	"1|www.my-domain.example"
_dmarc.my-domain.example.	IN	5m	TXT	"v=DMARC1; p=quarantine; sp=quarantine"

;SRV records
_autodiscover._tcp.my-domain.example.	IN	5m	SRV	0 0 443 mail.my-domain.example.
_imaps._tcp.my-domain.example.	IN	5m	SRV	0 0 993 mail.my-domain.example.

;CNAME records
autoconfig.my-domain.example.	IN	5m	CNAME	mail.my-domain.example.
```