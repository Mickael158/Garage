import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Crud.css';


const Fonction=()=> {

  const [data, setData] = useState('');
  const [fonctionData, setFonctionData] = useState([]);
  
//   const fonction = async (event) => {
//     event.preventDefault();
//     try {
//         const response = await axios.post(`http://localhost:8080/Fonction/insertion_Fonction`, 
//             { nom_fonction: data }, {
//             headers: {
//                 'content-Type': 'application/json',
//             },
//         });
//         console.log('ok', response.data);
//     } catch (error) {
//         console.error('Erreur de Verification', error);
//     }
// };

// const fetchFonctionData = async () => {
//     try {
//         const response = await axios.get('http://localhost:8080/Fonction/selectAll_Fonction');
//         setFonctionData(response.data);
//         console.log(fonctionData);
//     } catch (error) {
//         console.error('Erreur de récupération des données', error);
//     }
// };

// useEffect(() => {
//     fetchFonctionData();
// }, []);

  return (
    <>
    <form >
                            <label>Nom Fonction:</label>
                            <input
                                type="text"
                                placeholder="Insérer nom Fonction"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                required
                            />
                            <button type="submit">Valider</button>
                        </form>
    </>
  );
}

export default Fonction;
