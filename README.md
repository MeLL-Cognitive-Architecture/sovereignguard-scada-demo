# SovereignGuard SCADA: Demonstração de Autonomia Supervisionada

Demonstração de interface SCADA híbrida (CLP + IA) desenvolvida para o desafio **Google I/O 2026 (Code the Countdown)**. 

Este projeto ilustra a aplicação prática da **Arquitetura Cognitiva MeLL**, onde a Inteligência Artificial opera em paralelo a sistemas industriais determinísticos, garantindo rastreabilidade, segurança e soberania humana.

## 🛡️ Princípios de Engenharia Aplicados

* **Conformidade ISA-101:** Interface de alto desempenho (HMI) projetada com fundo neutro, *flat design* e uso rigoroso de cores (apenas para estados de atenção/falha), minimizando a carga cognitiva do operador.
* **Governança de IA (CIA-Tec™ v5.0):** A IA atua como supervisora de indicadores PCM (Planejamento e Controle de Manutenção), como MTBF e Backlog, sem interferir diretamente no controle de baixo nível (CLP).
* **Segurança e Soberania (NR-10):** Implementação de protocolos de intervenção de campo. A IA suspende o processo em caso de anomalias críticas, exigindo validação humana mandatória (Bloqueio LOTO, Teste de Tensão, APR) antes da retomada.
* **Padrão AGÉTICO ADK:** Utilização de agentes de IA orientados a eventos para monitoramento contínuo.

## 💻 Sobre o Código (`terminal_industrial_sovereignguard.tsx`)

O arquivo principal é um componente desenvolvido em **React** com **Tailwind CSS**, pronto para ser integrado a dashboards modernos. Ele simula:
1. O fluxo determinístico de uma contagem regressiva industrial.
2. O monitoramento paralelo via IA.
3. A interrupção de segurança e o painel de auditoria (ISA-99 compliance).

## 🚀 Como Executar Localmente
*(Instruções para desenvolvedores que desejarem rodar a demo)*
1. Clone este repositório.
2. Certifique-se de ter um ambiente React configurado (ex: Vite ou Next.js) com suporte a Tailwind CSS e Lucide-react (para os ícones industriais).
3. Importe o componente `terminal_industrial_sovereignguard.tsx` na sua página principal.

---
*Projeto desenvolvido por Luiz Carlos Rezende (Arquiteto na MeLL Cognitive Architecture).*
