import React, { useState } from 'react';

import { Form, Link } from 'react-router';
import { formatPrice } from '~/utils/formatters';

import { Button } from '../ui/Button';
import { FormField } from './FormField';

export function WorkOrderForm() {
  const inputClasses =
    'block w-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-indigo-500';

  // Estado para gerenciar a lista de serviços
  const [services, setServices] = useState([{ name: '', currentPrice: 0 }]);

  // Função para adicionar um novo serviço
  const handleAddService = () => {
    setServices([...services, { name: '', currentPrice: 0 }]);
  };

  // Função para remover um serviço pelo índices
  const handleRemoveService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  // Calcula o total dos preços dos serviços
  const calculateTotal = () => {
    return services.reduce(
      (sum, service) => sum + Number(service.currentPrice),
      0,
    );
  };

  return (
    <Form method="post">
      <FormField label="Descrição do Problema" htmlFor="description" required>
        <textarea
          id="description"
          name="description"
          placeholder="Descreva o problema ou serviço solicitado..."
          rows={4}
          className={inputClasses}
          required
        />
      </FormField>

      <div className="mb-6 border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Serviços</h2>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                <FormField
                  label="Nome do Serviço"
                  placeholder="Ex: Troca de óleo"
                  value={service.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newServices = [...services];
                    newServices[index] = {
                      ...newServices[index],
                      name: e.target.value,
                    };
                    setServices(newServices);
                  }}
                  required
                />

                <FormField
                  label="Preço (R$)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={service.currentPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newServices = [...services];
                    newServices[index] = {
                      ...newServices[index],
                      currentPrice: parseFloat(e.target.value) || 0,
                    };
                    setServices(newServices);
                  }}
                  required
                />
              </div>

              {services.length > 1 && (
                <div className="mt-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    variant="danger"
                    className="!px-3 !py-1 text-xs"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#f1f1f1"
                    >
                      <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                    </svg>
                    Remover
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={handleAddService}
          variant="secondary"
          className="mt-4 w-full text-xs md:w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#18181B"
          >
            <path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h528q29.7 0 50.85 21.15Q816-773.7 816-744v258q-17.1-5.76-35.1-9.92T744-502v-242H216v528h241q1.88 19.52 5.94 37.26Q467-161 473-144H216Zm0-96v24-528 242-2 264Zm72-48h172q4-19 10.19-36.97Q476.38-342.93 484-360H288v72Zm0-156h264q26-20 56-34.5t64-20.5v-17H288v72Zm0-156h384v-72H288v72ZM719.77-48Q640-48 584-104.23q-56-56.22-56-136Q528-320 584.23-376q56.22-56 136-56Q800-432 856-375.77q56 56.22 56 136Q912-160 855.77-104q-56.22 56-136 56ZM696-144h48v-72h72v-48h-72v-72h-48v72h-72v48h72v72Z" />
          </svg>
          Adicionar Serviço
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 items-end gap-6 md:grid-cols-2">
        <FormField label="Status Inicial">
          <select
            id="status"
            name="status"
            defaultValue="OPEN"
            className={inputClasses}
          >
            <option value="OPEN">Aberta</option>
            <option value="IN_PROGRESS">Em Progresso</option>
            <option value="COMPLETED">Concluída</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </FormField>

        <div className="flex items-center justify-between border border-indigo-100 bg-indigo-50 p-4">
          <span className="font-medium text-indigo-900">Total Estimado:</span>
          <span className="text-2xl font-bold text-indigo-700">
            R$ {formatPrice(calculateTotal())}
          </span>
        </div>
      </div>

      <FormField
        type="hidden"
        name="services"
        value={JSON.stringify(services)}
        className="!m-0"
      />

      <div className="flex flex-col-reverse gap-4 border-t border-gray-100 pt-6 md:flex-row">
        <Link
          to="/"
          className="inline-flex flex-1 items-center justify-center border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
        >
          Cancelar
        </Link>
        <Button
          type="submit"
          variant="primary"
          className="flex-[2] !py-3 font-bold tracking-wider uppercase"
        >
          Criar Ordem de Serviço
        </Button>
      </div>
    </Form>
  );
}
