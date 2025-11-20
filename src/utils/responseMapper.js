const normalizeToArray = (raw) => {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  
  if (typeof raw === 'object') {
    if (Array.isArray(raw.items)) return raw.items;
    return [raw];
  } 
  
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (s === '') return [];
    
    if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return s.split(',').map(x => x.trim()).filter(Boolean);
      }
    } else if (s.includes(',')) {
      return s.split(',').map(x => x.trim()).filter(Boolean);
    } else {
      return [s];
    }
  }
  return [];
};


export const mapEntity = (row, config = {}) => {
  if (!row) return null;
  
  const { dateFields = [], listFields = [] } = config; 
  
  const newRow = { ...row };

  if (Array.isArray(dateFields)) {
    dateFields.forEach(field => {
      if (newRow[field]) {
        try {
          newRow[field] = new Date(newRow[field]).toISOString().split('T')[0];
        } catch (error) {
          newRow[field] = null;
        }
      } else {
        newRow[field] = null;
      }
    });
  }

  if (Array.isArray(listFields)) {
    listFields.forEach(field => {
      newRow[field] = normalizeToArray(newRow[field]);
    });
  }

  return newRow;
};