export const abbreviateLikes = ( likes: number) => {
    if (typeof likes !== 'number') {
        throw new TypeError('Input must be a number');
      }
    
      if (likes < 1000) {
        return likes.toString(); // No abbreviation for likes below 1,000
      } else if (likes < 1000000) {
        const roundedThousands = Math.round(likes / 1000);
        return roundedThousands === 1000 ? '1k' : roundedThousands.toString() + 'k'; // Special case for 1000 to avoid '.0k'
      } else {
        const roundedMillions = Math.round(likes / 1000000);
        return roundedMillions === 1 ? '1M' : roundedMillions.toString() + 'M'; // Special case for 1 million to avoid '.0M'
      }
  }