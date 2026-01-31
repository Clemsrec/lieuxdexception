#!/bin/bash
# Script pour supprimer tous les border-radius (éléments arrondis) du site
# Demandé par le client : TOUT DOIT ÊTRE CARRÉ

echo "🔲 Suppression de TOUS les éléments arrondis du site..."
echo ""

# Liste des fichiers à modifier
FILES=(
  "src/components/VenuesMap.tsx"
  "src/components/VenuesCarousel.tsx"
  "src/components/VenueGallerySection.tsx"
  "src/components/PageContentComponents.tsx"
  "src/components/CookieBanner.tsx"
  "src/components/ContactFormHelpers.tsx"
  "src/components/ContactPageClient.tsx"
  "src/components/ScrollTimeline.tsx"
  "src/components/Footer.tsx"
  "src/components/VenueFilters.tsx"
  "src/components/ContactFormSwitcher.tsx"
  "src/components/CookieSettings.tsx"
  "src/components/HomeClient.tsx"
  "src/components/VenueGallery.tsx"
  "src/components/HeroCarousel.tsx"
  "src/components/Navigation.tsx"
  "src/components/FirebaseTest.tsx"
  "src/components/InteractiveMap.tsx"
  "src/app/[locale]/not-found.tsx"
  "src/app/[locale]/page.tsx"
  "src/app/[locale]/cookies/page.tsx"
  "src/app/[locale]/mentions-legales/page.tsx"
  "src/app/[locale]/mariages/page.tsx"
  "src/app/[locale]/evenements-b2b/page.tsx"
  "src/app/[locale]/cgv/page.tsx"
  "src/app/[locale]/galerie-histoire/page.tsx"
  "src/app/[locale]/lieux/[slug]/page.tsx"
  "src/app/[locale]/catalogue/page.tsx"
)

# Compteur
COUNT=0

# Remplacements à effectuer (du plus spécifique au plus général)
declare -A REPLACEMENTS=(
  ["rounded-full"]=""
  ["rounded-2xl"]=""
  ["rounded-xl"]=""
  ["rounded-lg"]=""
  ["rounded-md"]=""
  ["rounded-sm"]=""
  ["rounded"]=""
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Traitement de $file..."
    
    # Faire les remplacements en cascade
    for pattern in "rounded-full" "rounded-2xl" "rounded-xl" "rounded-lg" "rounded-md" "rounded-sm" "rounded"; do
      # Compter les occurrences avant
      before=$(grep -o "$pattern" "$file" 2>/dev/null | wc -l | tr -d ' ')
      
      if [ "$before" -gt 0 ]; then
        # Supprimer le pattern (avec espace avant ou après)
        sed -i '' "s/ $pattern / /g" "$file"
        sed -i '' "s/ $pattern\"/ \"/g" "$file"
        sed -i '' "s/\"$pattern /\" /g" "$file"
        sed -i '' "s/ $pattern}/ }/g" "$file"
        sed -i '' "s/{$pattern /{/g" "$file"
        
        # Compter après
        after=$(grep -o "$pattern" "$file" 2>/dev/null | wc -l | tr -d ' ')
        removed=$((before - after))
        
        if [ "$removed" -gt 0 ]; then
          echo "   ✅ Supprimé $removed × $pattern"
          COUNT=$((COUNT + removed))
        fi
      fi
    done
    
    # Nettoyer les doubles espaces créés
    sed -i '' 's/  / /g' "$file"
    sed -i '' 's/className=" /className="/g' "$file"
    sed -i '' 's/ "/"/' "$file"
    
  else
    echo "   ⚠️  Fichier non trouvé: $file"
  fi
done

echo ""
echo "✅ Terminé ! $COUNT éléments arrondis supprimés."
echo "🔲 Le site est maintenant 100% CARRÉ comme demandé !"
