import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import { NumericFormat } from "react-number-format";
import { addCompra } from "../firebase/itens";
import "../styles/AddItemComponent.css";
import { UsuarioContext } from "../contexts/UsuarioContext";

function AddItemComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const [numero, setNumero] = useState(1);
  const [preco, setPreco] = useState(0);
  const [precoTotal, setPrecoTotal] = useState(preco);

  const { usuarioLogado } = useContext(UsuarioContext);

  if (usuarioLogado === null) {
    return <Navigate to="/" />;
  }

  async function salvarItem(data) {
    try {
      data.idUsuario = usuarioLogado.uid;
      const dataComPrecoTotal = { ...data, precoTotal, quantidade: numero };
      await addCompra(dataComPrecoTotal);
      toast.success("Item adicionado com sucesso");
      navigate("/itens");
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      toast.error("Erro ao adicionar item");
    }
  }

  function handleIncremento() {
    const newNumero = numero + 1;
    setNumero(newNumero);
    setPrecoTotal(newNumero * preco);
  }

  function handleDecremento() {
    if (numero > 1) {
      const newNumero = numero - 1;
      setNumero(newNumero);
      setPrecoTotal(newNumero * preco);
    }
  }

  function handlePrecoChange(values) {
    const { floatValue } = values;
    if (typeof floatValue === "number" && floatValue >= 0) {
      setPreco(floatValue);
      setPrecoTotal(floatValue * numero);
      setValue("preco", floatValue);
    }
  }

    return (
        <main className="container">
            <form className="form-section" onSubmit={handleSubmit(cadastrar)}>
                <h1>Adicionar item</h1>
                <div>
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        className="form-control"
                        placeholder="Digite o seu item"
                        {...register("nome", { required: true, maxLength: 100 })}
                    />
                    {errors.nome && (
                        <small className="invalid">O nome é inválido!</small>
                    )}
                </div>
                <div>
                    <label htmlFor="preco">Preço</label>
                    <input
                        type="number"
                        id="preco"
                        className="form-control"
                        placeholder="Digite o preço"
                        {...register("preco", { required: true })}
                    />
                    {errors.preco && (
                        <small className="invalid">O preço é inválido!</small>
                    )}
                </div>
                <div>
                    <label htmlFor="quantidade">Quantidade</label>
                    <div  className="quantidade">
                    <Button 
                    className="mt-1 w-20 btn-custom" 
                    type="button"
                    onClick={handleDecremento}>
                        -
                    </Button>
                    {numero}
                    <Button 
                    className="mt-1 w-20 btn-custom" 
                    type="button"
                    onClick={handleIncremento}>
                        +
                    </Button>
                    </div>
                </div>
                <div>
                    <label htmlFor="categoria">Categoria</label>
                    <select
                        id="categoria"
                        className="form-select"
                        {...register("categoria")}
                    >
                        <option value="Selecionar">Selecionar categoria</option>
                        <option value="Alimentos">Alimentos</option>
                        <option value="Higiene">Hortifruti</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Higiene">Higiene</option>
                        <option value="Limpeza">Limpeza</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="descricao">Descrição</label>
                    <textarea
                        id="descricao"
                        className="form-control"
                        {...register("descricao", { required: true })}
                    ></textarea>
                    {errors.descricao && <small className="invalid">A descrição é inválida</small>}
                </div>
                <div className="mt-4">
                    <Button className="mt-1 w-100 btn-custom" type="submit">
                        Adicionar
                    </Button>
                </div>
            </form>
        </main>
    );
}

export default AddItemComponent;
