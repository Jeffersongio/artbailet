import React, { useState, useEffect, useContext } from "react";
import "./styles.scss";
import Lottie from "react-lottie";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "react-data-table-component";
import ModalCrud from "../../../Components/ModalCrud";
import { ColumsTableSetores } from "../../../Services/TableColumns";
import MainContext from "../../../Contexts/MainContext";
import api from "../../../Services/api";
import { ALL_SETOR } from "../../../Services/Endpoints";
import { showToast } from "../../../Functions";
import AddSelectedSetor from "../../../Components/RenderSelectedRow/Setores/AddSelectedSetor";
import SelectedSetor from "../../../Components/RenderSelectedRow/Setores/SelectedSetor";

const LOADING = require("../../../Assets/animations/loading.json");

const Setor: React.FC = () => {
    const {
        token,
        openMoreInfo,
        setOpenMoreInfo,
        hasCloseEditModal,
        addModalOpen,
        setaddModalOpen,
    } = useContext(MainContext);

    const [isLoading, setIsLoading] = useState(false);
    const [allSetores, setAllSetores] = useState([]);
    const [selectedSetor, setSelectedSetor] = useState({});

    useEffect(() => {
        document.title = "Marca Ponto - Setores";
        setOpenMoreInfo(false);
        getAllSetores();
    }, []);

    useEffect(() => {
        getAllSetores();
    }, [hasCloseEditModal]);

    const getAllSetores = async () => {
        setIsLoading(true);
        await api
            .get(ALL_SETOR, { headers: { Authorization: token } })
            .then((resp) => {
                const { status, data } = resp;
                if (status === 200) {
                    setAllSetores(data);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                showToast("ERROR", "Algo deu errado 🤨", {});
            });
    };

    const closeModal = () => {
        setaddModalOpen(false);
        return true;
    };

    const closeModalMoreInfo = () => {
        setOpenMoreInfo(false);
        return true;
    };

    // const handleRowChange = (state: any) => {
    //     console.log("Selected Rows: ", state.selectedRows);
    // };

    const showMoreInfo = async (dataFromRow: any) => {
        setOpenMoreInfo(true);
        setSelectedSetor(dataFromRow);
    };

    return (
        <>
            <div className="usuarios__wrapper">
                {!isLoading ? (
                    <div className="table__wrapper">
                        <div className="usuarios__header">
                            <a
                                href="#new"
                                className="bt"
                                onClick={() => setaddModalOpen(true)}
                            >
                                + Novo Setor
                            </a>
                        </div>
                        <DataTable
                            title="Todos os Expedientes"
                            data={allSetores.map((c: any) =>
                                c.ativo
                                    ? { ...c, ativo: "true" }
                                    : { ...c, ativo: "false" }
                            )}
                            columns={ColumsTableSetores}
                            striped={true}
                            pagination={true}
                            onRowClicked={showMoreInfo}
                            pointerOnHover={true}
                            highlightOnHover={true}
                        />
                    </div>
                ) : (
                    <div className="animation__wrapper">
                        <Lottie
                            options={{
                                loop: true,
                                animationData: LOADING,
                            }}
                            height={150}
                            width={150}
                        />
                        <h2>
                            Estamos carregando seus dados
                            <span role="img" aria-label="Whoops">
                                🧐
                            </span>{" "}
                        </h2>
                    </div>
                )}
            </div>

            {addModalOpen && (
                <ModalCrud onClose={closeModal}>
                    <AddSelectedSetor />
                </ModalCrud>
            )}

            {openMoreInfo && (
                <ModalCrud onClose={closeModalMoreInfo}>
                    {selectedSetor ? (
                        <SelectedSetor data={selectedSetor} />
                    ) : (
                        ""
                    )}
                </ModalCrud>
            )}
        </>
    );
};
export default Setor;
