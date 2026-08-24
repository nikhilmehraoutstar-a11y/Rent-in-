/* RentIn Jabalpur: static-first; it runs without Node or a local server. */
(() => {
  const CENTER = [23.1815, 79.9864];
  const STORAGE_KEY = 'rentin-jabalpur-listings-v1';
  const demoListings = [
    { id: 'demo-1', title: 'Sunrise Girls PG', property_type: 'PG', description: 'Near coaching centres. Double-sharing beds, food and Wi-Fi available.', area: 'Vijay Nagar', address: 'Near ISBT, Vijay Nagar, Jabalpur', latitude: 23.201, longitude: 79.950, rent: 6500, available_beds: 2, contact_name: 'Demo owner', contact_phone: '9999999999', created_at: new Date().toISOString() },
    { id: 'demo-2', title: 'Student Room Share', property_type: 'Room', description: 'A shared room for one student, close to public transport.', area: 'Gwarighat', address: 'Gwarighat Road, Jabalpur', latitude: 23.145, longitude: 79.933, rent: 4000, available_beds: 1, contact_name: 'Demo owner', contact_phone: '9999999998', created_at: new Date().toISOString() },
  ];
  const el = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const formatRent = (rent) => rent ? `₹${Number(rent).toLocaleString('en-IN')}/month` : 'Ask for rent';
  const map = L.map('listing-map', { scrollWheelZoom: false }).setView(CENTER, 12);
  const pickerMap = L.map('picker-map').setView(CENTER, 13);
  const tiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  L.tileLayer(tiles, { attribution, maxZoom: 19 }).addTo(map);
  L.tileLayer(tiles, { attribution, maxZoom: 19 }).addTo(pickerMap);
  const markerLayer = L.layerGroup().addTo(map);
  const pinStyle = { color: '#fff', fillColor: '#df6345', fillOpacity: 1, weight: 3 };
  let pickerMarker = L.circleMarker(CENTER, { radius: 10, ...pinStyle }).addTo(pickerMap);
  let chosenPosition = { latitude: CENTER[0], longitude: CENTER[1] };
  let listings = [];
  let selectedId = null;
  const config = window.RENTIN_CONFIG || {};
  const supabaseClient = window.supabase && config.supabaseUrl && config.supabaseAnonKey ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey) : null;

  function localListings() {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(saved) && saved.length ? saved : demoListings; } catch { return demoListings; }
  }
  function saveLocal() { localStorage.setItem(STORAGE_KEY, JSON.stringify(listings)); }
  function setPosition(latitude, longitude) {
    chosenPosition = { latitude, longitude };
    pickerMarker.setLatLng([latitude, longitude]);
    pickerMap.setView([latitude, longitude], 16);
  }
  function visibleListings() {
    const query = el('search').value.trim().toLowerCase();
    return listings.filter((listing) => !query || `${listing.title} ${listing.area} ${listing.property_type}`.toLowerCase().includes(query));
  }
  function selectListing(id) {
    selectedId = id;
    const listing = listings.find((item) => item.id === id);
    if (!listing) return;
    map.flyTo([listing.latitude, listing.longitude], 16, { duration: 0.6 });
    render();
  }
  function render() {
    const visible = visibleListings();
    const panel = el('listing-panel');
    markerLayer.clearLayers();
    if (!visible.length) panel.innerHTML = '<div class="empty"><strong>No vacancies found yet.</strong><span>Be the first owner to add one.</span></div>';
    else panel.innerHTML = visible.map((listing) => `<button class="listing-card ${listing.id === selectedId ? 'active' : ''}" data-listing-id="${escapeHtml(listing.id)}"><div class="card-top"><span class="tag">${escapeHtml(listing.property_type)}</span><span>${listing.available_beds} bed${listing.available_beds === 1 ? '' : 's'} free</span></div><h3>${escapeHtml(listing.title)}</h3><p>${escapeHtml(listing.area)}</p><strong>${formatRent(listing.rent)}</strong></button>`).join('');
    panel.querySelectorAll('[data-listing-id]').forEach((button) => button.addEventListener('click', () => selectListing(button.dataset.listingId)));
    visible.forEach((listing) => {
      const marker = L.circleMarker([listing.latitude, listing.longitude], { radius: 11, ...pinStyle }).addTo(markerLayer);
      marker.bindPopup(`<strong>${escapeHtml(listing.title)}</strong><br>${listing.available_beds} bed${listing.available_beds === 1 ? '' : 's'} available<br><button class="popup-button">See details</button>`);
      marker.on('click', () => selectListing(listing.id));
      marker.on('popupopen', () => marker.getPopup().getElement().querySelector('button').addEventListener('click', () => selectListing(listing.id)));
    });
    const selected = listings.find((listing) => listing.id === selectedId);
    const details = el('details');
    if (!selected) { details.hidden = true; return; }
    const phone = String(selected.contact_phone).replace(/\D/g, '').slice(-10);
    const whatsapp = `https://wa.me/91${phone}?text=${encodeURIComponent(`Hi, I am interested in ${selected.title} on RentIn Jabalpur.`)}`;
    const directions = `https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`;
    details.hidden = false;
    details.innerHTML = `<button class="close" id="close-details" aria-label="Close details">×</button><span class="tag">${escapeHtml(selected.property_type)}</span><h2>${escapeHtml(selected.title)}</h2><p class="location">⌖ ${escapeHtml(selected.address)}</p><div class="facts"><span><b>${selected.available_beds}</b> beds available</span><span><b>${formatRent(selected.rent)}</b></span></div><p>${escapeHtml(selected.description)}</p><div class="detail-actions"><a class="primary-button" target="_blank" rel="noreferrer" href="${whatsapp}">WhatsApp owner</a><a class="secondary-button" target="_blank" rel="noreferrer" href="${directions}">Get directions</a></div>`;
    el('close-details').addEventListener('click', () => { selectedId = null; render(); });
  }
  function openModal() { el('listing-modal').hidden = false; document.body.style.overflow = 'hidden'; setTimeout(() => pickerMap.invalidateSize(), 50); }
  function closeModal() { el('listing-modal').hidden = true; document.body.style.overflow = ''; el('form-error').hidden = true; }
  async function loadListings() {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('listings').select('*').order('created_at', { ascending: false });
      if (!error) {
        listings = data;
        el('data-status').textContent = 'Live Supabase data is connected. New vacancies are immediately visible to visitors.';
        el('data-status').className = 'setup-note form-success';
        render();
        return;
      }
    }
    listings = localListings();
    render();
  }
  el('open-listing').addEventListener('click', openModal);
  el('hero-listing').addEventListener('click', openModal);
  el('close-modal').addEventListener('click', closeModal);
  el('listing-modal').addEventListener('click', (event) => { if (event.target === el('listing-modal')) closeModal(); });
  el('search').addEventListener('input', render);
  pickerMap.on('click', (event) => setPosition(event.latlng.lat, event.latlng.lng));
  el('use-location').addEventListener('click', () => navigator.geolocation?.getCurrentPosition(
    (position) => setPosition(position.coords.latitude, position.coords.longitude),
    () => { el('form-error').textContent = 'Location was not available. Please tap the exact property location on the map.'; el('form-error').hidden = false; },
  ));
  el('listing-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const button = el('publish-button');
    const error = el('form-error');
    const listing = { id: crypto.randomUUID(), title: form.get('title').trim(), property_type: form.get('property_type'), description: form.get('description').trim(), area: form.get('area').trim(), address: form.get('address').trim(), latitude: chosenPosition.latitude, longitude: chosenPosition.longitude, rent: form.get('rent') ? Number(form.get('rent')) : null, available_beds: Number(form.get('available_beds')), contact_name: form.get('contact_name').trim(), contact_phone: form.get('contact_phone').trim(), created_at: new Date().toISOString() };
    button.disabled = true; button.textContent = 'Publishing…'; error.hidden = true;
    try {
      if (supabaseClient) {
        const { error: saveError } = await supabaseClient.from('listings').insert(listing);
        if (saveError) throw saveError;
      } else saveLocal();
      listings.unshift(listing);
      if (!supabaseClient) saveLocal();
      selectedId = listing.id;
      event.currentTarget.reset();
      closeModal();
      render();
    } catch {
      error.textContent = 'Your listing could not be saved. Please try again.';
      error.hidden = false;
    } finally { button.disabled = false; button.textContent = 'Publish vacancy'; }
  });
  loadListings();
})();
