import Link from "next/link";
import { siteSettings } from "@/lib/siteSettings";

export default function PolitiqueConfidentialite() {
  const addressLines = [...siteSettings.address_lines, siteSettings.city].filter(Boolean) as string[];
  const showPhone = Boolean(siteSettings.phone_display && siteSettings.phone_href);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/"
          className="font-serif text-xl text-charcoal hover:text-emerald transition-colors"
        >
          &larr; Retour
        </Link>

        <h1 className="font-serif text-4xl text-charcoal mt-8 mb-8">
          Politique de confidentialit&eacute;
        </h1>
        <p className="font-sans text-xs text-charcoal-light/50 mb-8">
          Derni&egrave;re mise &agrave; jour : mars 2026
        </p>

        <div className="space-y-8 font-sans text-sm text-charcoal/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des donn&eacute;es personnelles est{" "}
              <strong>{siteSettings.legal_identity.entity_name}</strong>.
            </p>
            {addressLines.length > 0 ? (
              <p className="mt-2">
                {addressLines.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < addressLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            ) : null}
            {showPhone && siteSettings.phone_display && siteSettings.phone_href ? (
              <p className="mt-2">
                T&eacute;l&eacute;phone :{" "}
                <a href={siteSettings.phone_href} className="text-emerald hover:underline">
                  {siteSettings.phone_display}
                </a>
              </p>
            ) : null}
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">2. Donn&eacute;es collect&eacute;es</h2>
            <p>Dans le cadre de la prise de rendez-vous en ligne, nous collectons :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Nom complet</strong> : pour identifier votre rendez-vous
              </li>
              <li>
                <strong>Num&eacute;ro de t&eacute;l&eacute;phone</strong> : pour vous joindre en cas de
                changement ou d&apos;ajustement
              </li>
            </ul>
            <p className="mt-2">
              Aucune donn&eacute;e bancaire ni aucun identifiant client n&apos;est demand&eacute; sur ce site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">3. Finalit&eacute; du traitement</h2>
            <p>Vos donn&eacute;es sont utilis&eacute;es uniquement pour :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>g&eacute;rer et confirmer vos rendez-vous ;</li>
              <li>vous joindre en cas de modification ;</li>
              <li>conserver un suivi simple de vos prestations.</li>
            </ul>
            <p className="mt-2">
              Elles ne sont ni vendues, ni lou&eacute;es, ni transmises &agrave; des tiers &agrave; des
              fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">4. Dur&eacute;e de conservation</h2>
            <p>
              Les donn&eacute;es li&eacute;es aux rendez-vous sont conserv&eacute;es pendant la relation
              commerciale puis archiv&eacute;es ou supprim&eacute;es selon les besoins de suivi et les
              obligations applicables.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">5. H&eacute;bergement</h2>
            <p>
              Le site et ses donn&eacute;es sont h&eacute;berg&eacute;s par <strong>{siteSettings.host.name}</strong>.
            </p>
            <p className="mt-2">
              {siteSettings.host.address_lines.join(", ")}.
              <br />
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
            <h2 className="font-serif text-xl text-charcoal mb-3">6. Vos droits</h2>
            <p>
              Conform&eacute;ment au RGPD, vous pouvez demander l&apos;acc&egrave;s, la rectification,
              la suppression ou la limitation du traitement de vos donn&eacute;es.
            </p>
            {showPhone && siteSettings.phone_display && siteSettings.phone_href ? (
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous au{" "}
                <a href={siteSettings.phone_href} className="text-emerald hover:underline">
                  {siteSettings.phone_display}
                </a>
                .
              </p>
            ) : (
              <p className="mt-3 text-charcoal/65">
                Les coordonn&eacute;es de contact d&eacute;di&eacute;es &agrave; l&apos;exercice de ces droits seront
                compl&eacute;t&eacute;es avant mise en production publique.
              </p>
            )}
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">7. Cookies</h2>
            <p>
              Ce site n&apos;utilise pas de traceur publicitaire. Seuls des cookies techniques
              indispensables &agrave; son fonctionnement peuvent &ecirc;tre utilis&eacute;s.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">8. R&eacute;clamation</h2>
            <p>
              Si vous estimez que le traitement de vos donn&eacute;es n&apos;est pas conforme, vous
              pouvez adresser une r&eacute;clamation &agrave; la CNIL :
              <br />
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald hover:underline"
              >
                www.cnil.fr
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
