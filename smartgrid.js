module.exports = {
   outputStyle: 'less', /* less || scss || sass || styl */
   columns: 12,
   offset: '20px', /*  px || % || rem */
   mobileFirst: false,
   detailedCalc: true,
   container: {
      maxWidth: '940px', 
      fields: '10px' 
   },
   breakPoints: {
      lg: {
         width: '1100px', /* -> @media (max-width: 1100px) */
      },
      md: {
         width: '960px'
      },
      sm: {
         width: '780px'
      },
      xs: {
         width: '560px'
      }
      
      /* 
      some_name: {
          width: 'Npx',
          fields: 'N(px|%|rem)',
          offset: 'N(px|%|rem)'
      }
      */
   }
};