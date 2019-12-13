import Correios from '../../services/Correios';

class SearchController {
  async show(req, res) {
    const address = await Correios(req.params);

    if (address.length === 0) {
      return res.status(404).json({ error: 'Cep não localizado!' });
    }

    return res.json(address);
  }
}

export default new SearchController();
