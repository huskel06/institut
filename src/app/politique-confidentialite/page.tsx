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
          ← Retour
        </Link>

        <h1 className="font-serif text-4xl text-charcoal mt-8 mb-8">
          Politique de confidentialité
        </h1>
        <p className="font-sans text-xs text-charcoal-light/50 mb-8">
          Dernière mise à jour : mars 2026
        </p>

        <div className="space-y-8 font-sans text-sm text-charcoal/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est{" "}
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
                Téléphone :{" "}
                <a href={siteSettings.phone_href} className="text-emerald hover:underline">
                  {siteSettings.phone_display}
                </a>
              </p>
            ) : null}
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">2. Données collectées</h2>
            <p>Dans le cadre de la prise de rendez-vous en ligne, nous collectons :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Nom complet</strong> : pour identifier votre rendez-vous
              </li>
              <li>
                <strong>Numéro de téléphone</strong> : pour vous joindre en cas de
                changement ou d'ajustement
              </li>
            </ul>
            <p className="mt-2">
              Aucune donnée bancaire ni aucun identifiant client n'est demandé sur ce site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">3. Finalité du traitement</h2>
            <p>Vos données sont utilisées uniquement pour :</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>gérer et confirmer vos rendez-vous ;</li>
              <li>vous joindre en cas de modification ;</li>
              <li>conserver un suivi simple de vos prestations.</li>
            </ul>
            <p className="mt-2">
              Elles ne sont ni vendues, ni louées, ni transmises à des tiers à des
              fins commerciales.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">4. Durée de conservation</h2>
            <p>
              Les données liées aux rendez-vous sont conservées pendant la relation
              commerciale puis archivées ou supprimées selon les besoins de suivi et les
              obligations applicables.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">5. Hébergement</h2>
            <p>
              Le site et ses données sont hébergés par <strong>{siteSettings.host.name}</strong>.
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
              Conformément au RGPD, vous pouvez demander l'accès, la rectification,
              la suppression ou la limitation du traitement de vos données.
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
                Les coordonnées de contact dédiées à l'exercice de ces droits seront
                complétées avant mise en production publique.
              </p>
            )}
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">7. Cookies</h2>
            <p>
              Ce site n'utilise pas de traceur publicitaire. Seuls des cookies techniques
              indispensables à son fonctionnement peuvent être utilisés.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">8. Réclamation</h2>
            <p>
              Si vous estimez que le traitement de vos données n'est pas conforme, vous
              pouvez adresser une réclamation à la CNIL :
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
