// Design proposals, not factual product specifications or an available inventory.
export const categories = ['Sve', 'Za nositi', 'Za igru', 'Izvan igre'] as const;
export type Category = typeof categories[number];
export const products = [
  { id: 'tee', category: 'Za nositi', name: 'Normal uniforma', type: 'Oversized majica', line: 'Dress code: svoj đir.', description: 'Isprana crna, veliki natpis i mali crveni cilj. Ideja za majicu koja ide na trening i ostaje na tebi poslije.' },
  { id: 'robe', category: 'Izvan igre', name: 'Double out', type: 'Ogrtač + papuče', line: 'Iz igre. U ogrtač.', description: 'Crni frotir, crveni rub i klupski vez. Koncept kompleta za ozbiljno neozbiljan oporavak na kauču.' },
  { id: 'calendar', category: 'Izvan igre', name: 'Vruća sezona / 2027', type: 'Godišnji kalendar', line: 'Dvanaest mjeseci. Malo manje dresa.', description: 'Razigran, seksi kalendar u sportskom editorijalnom stilu. AI prikaz izmišljenog odraslog modela, ne člana kluba. Stvarno izdanje tražilo bi dobrovoljne modele i njihovu suglasnost.' },
  { id: 'hoodie', category: 'Za nositi', name: 'Produžeci', type: 'Hoodie', line: 'Još jednu. Pa doma.', description: 'Crna majica s kapuljačom i diskretnim klupskim potpisom. Za hladan put kući nakon vrućeg meča.' },
  { id: 'darts', category: 'Za igru', name: 'Tri razloga', type: 'Pikado putni set', line: 'Tvoj mali arsenal.', description: 'Vizija putne kutije sa strelicama, rezervnim perima i ručnikom. Oblik, težina i sadržaj tek bi se definirali za proizvodnju.' },
  { id: 'mug', category: 'Izvan igre', name: 'Prva runda', type: 'Šalica + podmetač', line: 'Prvo kava. Onda preciznost.', description: 'Crna šalica, crvena unutrašnjost i podmetač u obliku mete. Mali jutarnji ritual s velikim klupskim slovima.' },
  { id: 'tote', category: 'Za nositi', name: 'Sve nosim', type: 'Platnena torba', line: 'Za opremu. I usputni kruh.', description: 'Prirodno platno, crne ručke i tipografija koju ne možeš promašiti. Klupska torba za sasvim normalne obaveze.' },
  { id: 'candle', category: 'Izvan igre', name: 'Mirna ruka', type: 'Mirisna svijeća', line: 'Upali fokus. Ugasi dramu.', description: 'Koncept svijeće u crnom staklu za atmosferu nakon meča. Zamišljeni miris: cedar i crni papar. Miris i sastav nisu potvrđeni.' },
  { id: 'socks', category: 'Za nositi', name: 'Čvrst stav', type: 'Sportske čarape', line: 'Stabilno do zadnjeg bacanja.', description: 'Svijetle rebraste čarape s crvenom linijom i klupskim natpisom. Diskretan znak da i stopala igraju za ekipu.' },
  { id: 'cap', category: 'Za nositi', name: 'Glava u igri', type: 'Šilterica', line: 'Fokus pod šiltom.', description: 'Isprana crna šilterica s bijelim vezom i crvenim detaljem. Minimalan dizajn za maksimalno često nošenje.' },
  { id: 'umbrella', category: 'Izvan igre', name: 'Kiša? Normalno.', type: 'Kišobran', line: 'Promaši lokvu.', description: 'Crna kupola, radijalne linije i klupski potpis. Ideja za gostovanja na kojima prognoza nije na našoj strani.' },
  { id: 'mat', category: 'Izvan igre', name: 'Dobro došli u ekipu', type: 'Otirač', line: 'Kućni teren počinje ovdje.', description: 'Otirač zamišljen kao linija bacanja. Za ulaz koji odmah daje do znanja kakva ekipa živi unutra.' },
] satisfies { id: string; category: Category; name: string; type: string; line: string; description: string }[];
export type Product = typeof products[number];
