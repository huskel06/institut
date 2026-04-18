import Link from "next/link";
import { siteSettings } from "@/lib/siteSettings";

export default function MentionsLegales() {
  const addressLines = [...siteSettings.address_lines, siteSettings.city].filter(Boolean) as string[];
  const showPhone = Boolean(siteSettings.phone_display && siteSettings.phone_href);
  const showAddress = addressLines.length > 0;
  const hasLegalDetails = showAddress || showPhone || Boolean(siteSettings.legal_identity.siret);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/"
          className="font-serif text-xl text-charcoal hover:text-emerald transition-colors"
        >
          &larr; Retour
        </Link>

        <h1 className="font-serif text-4xl text-charcoal mt-8 mb-8">Mentions l&eacute;gales</h1>

        <div className="space-y-8 font-sans text-sm text-charcoal/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">&Eacute;diteur du site</h2>
            <p>
              <strong>{siteSettings.legal_identity.entity_name}</strong>
              <br />
              {siteSettings.legal_identity.business_description}
            </p>

            {showAddress ? (
              <p className="mt-3">
                {addressLines.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < addressLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            ) : null}

            {showPhone && siteSettings.phone_display && siteSettings.phone_href ? (
              <p className="mt-3">
                T&eacute;l&eacute;phone :{" "}
                <a href={siteSettings.phone_href} className="text-emerald hover:underline">
                  {siteSettings.phone_display}
                </a>
              </p>
            ) : null}

            {siteSettings.legal_identity.siret ? (
              <p className="mt-3">SIRET : {siteSettings.legal_identity.siret}</p>
            ) : null}

            {!hasLegalDetails ? (
              <p className="mt-3 text-charcoal/65">
                Les informations d&apos;identification compl&eacute;mentaires seront compl&eacute;t&eacute;es avant
                mise en production publique.
              </p>
            ) : null}
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">H&eacute;bergement</h2>
            <p>
              Ce site est h&eacute;berg&eacute; par :
              <br />
              <strong>{siteSettings.host.name}</strong>
              <br />
              {siteSettings.host.address_lines.map((line, index) => (
                <span key={`${line}-${index}`}>
                  {line}
                  <br />
                </span>
              ))}
              Site web :{" "}
              <a
                href={siteSettings.host.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald hover:underline"
              >
                {siteSettings.host.website.replace(/^https?:\/\//, "")}
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">Propri&eacute;t&eacute; intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos, graphismes) reste la
              propri&eacute;t&eacute; de {siteSettings.brand_name}, sauf mention contraire. Toute
              reproduction, repr&eacute;sentation, modification ou exploitation de tout ou partie de
              ce contenu, par quelque proc&eacute;d&eacute; que ce soit, sans autorisation pr&eacute;alable
              et &eacute;crite, est interdite.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">Donn&eacute;es personnelles</h2>
            <p>
              Les informations collect&eacute;es via le formulaire de r&eacute;servation (nom,
              t&eacute;l&eacute;phone) sont utilis&eacute;es uniquement pour organiser les rendez-vous et
              assurer leur suivi.
            </p>
            <p className="mt-2">
              Pour en savoir plus, consultez notre{" "}
              <Link href="/politique-confidentialite/" className="text-emerald hover:underline">
                politique de confidentialit&eacute;
              </Link>
              .
            </p>
            {!showPhone ? (
              <p className="mt-2 text-charcoal/65">
                Les coordonn&eacute;es de contact d&eacute;di&eacute;es &agrave; l&apos;exercice des droits seront pr&eacute;cis&eacute;es
                avant mise en ligne publique.
              </p>
            ) : null}
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">Cookies</h2>
            <p>
              Ce site n&apos;utilise pas de cookie publicitaire. Seuls les cookies techniques
              indispensables au fonctionnement du service peuvent &ecirc;tre utilis&eacute;s.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
