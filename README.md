# SovereignGuard SCADA: Demonstração de Autonomia Supervisionada

Demonstração de interface SCADA híbrida (CLP + IA) desenvolvida originalmente para a iniciativa **Google I/O 2026 (Code the Countdown)**. 

[cite_start]Este projeto ilustra a aplicação prática da **Arquitetura Cognitiva MeLL**, onde a Inteligência Artificial opera em paralelo a sistemas industriais determinísticos, garantindo rastreabilidade, segurança regulatória e soberania humana em ambientes críticos[cite: 4, 5, 6].

## 🚀 Demonstração ao Vivo
O projeto está compilado e hospedado nativamente no GitHub Pages. Acesse a interface operacional pelo link abaixo:
👉 **[https://mell-cognitive-architecture.github.io/sovereignguard-scada-demo/](https://mell-cognitive-architecture.github.io/sovereignguard-scada-demo/)**

---

## 🛡️ Princípios de Engenharia Aplicados

* [cite_start]**Conformidade ISA-101 (High-Performance HMI):** Interface de alto desempenho projetada com fundo cinza neutro para redução de fadiga ocular, uso de *flat design* (sem gradientes ou elementos 3D decorativos) e aplicação estrita de cores (Cores Ativas) apenas para sinalização de alarmes ou advertências[cite: 8, 10, 11, 12, 61].
* **Governança de IA (CIA-Tec™ v5.0):** Camada de Inteligência Artificial atuando estritamente em Modo Paralelo como supervisora cognitiva de indicadores PCM (Planejamento e Controle de Manutenção), monitorando tendências de **MTBF** (Tempo Médio Entre Falhas) e **Backlog** sem interferir no determinismo de baixo nível (CLP).
* **Segurança e Intervencionismo Humano (NR-10 & ISA-99):** Interlock de segurança ativado por IA sob condições críticas de processo. [cite_start]O sistema suspende temporariamente o avanço automático da operação e exige validação manual obrigatória em campo: protocolo de bloqueio mecânico/elétrico (**LOTO**), teste de ausência de tensão e assinatura de **APR** (Análise Preliminar de Risco)[cite: 16].
* **Arquitetura AGÉTICO ADK:** Utilização de agentes de IA orientados a eventos para monitoramento preditivo e telemetria contínua.

---

## 💻 Estrutura do Projeto

O ecossistema está configurado utilizando uma estrutura moderna de Single Page Application (SPA):
* [cite_start]**`terminal_industrial_sovereignguard.tsx`:** O componente React principal contendo a lógica de estados, renderização dos painéis hierárquicos (L1: Operação, L2: Sinótico, L3: Tendências, L4: Auditoria), cálculo do gráfico radar (*Health Signature*) e gerador de hashes de rastreabilidade[cite: 13, 16, 68].
* [cite_start]**`main.tsx` & `index.html`:** Ponto de entrada do ecossistema e injeção do motor React, utilizando Tailwind CSS para renderização ágil de componentes planos[cite: 12].
* **`vite.config.js`:** Configuração do empacotador Vite estabelecendo a base path para distribuição correta de subdiretórios no GitHub Pages.
* **`.github/workflows/deploy.yml`:** Pipeline de CI/CD em automação contínua configurado sob **Node.js 24**, realizando o *build* produtivo e a entrega automatizada na nuvem do GitHub Actions.

---

## 🛠️ Como Executar Localmente

Se desejar clonar e rodar este ecossistema de supervisão em sua máquina local, certifique-se de ter o **Node.js (v20 ou superior)** instalado.

1. **Clonar o Repositório:**
   ```bash
   git clone [https://github.com/MeLL-Cognitive-Architecture/sovereignguard-scada-demo.git](https://github.com/MeLL-Cognitive-Architecture/sovereignguard-scada-demo.git)
   cd sovereignguard-scada-demo
