import React from 'react'
import { CustomDropdown } from '../../../../components/common/CustomDropdown'
import type { AlgorithmConfig } from '../types'

interface AlgorithmConfigViewProps {
  algoConfig: AlgorithmConfig
  setAlgoConfig: React.Dispatch<React.SetStateAction<AlgorithmConfig>>
  onPublishAlgorithms: () => void
}

export const AlgorithmConfigView: React.FC<AlgorithmConfigViewProps> = ({
  algoConfig,
  setAlgoConfig,
  onPublishAlgorithms
}) => {
  return (
    <div className="view-algo-admin">
      <div className="algo-grid-container">
        {/* Algorithm Sliders */}
        <div className="admin-card">
          <div className="card-header-row">
            <h3>Storefront Ranking Algorithms</h3>
            <span className="badge-pill">Live Weighting Engine</span>
          </div>
          <div className="algo-control-group">
            <div className="algo-field">
              <div className="algo-label-row">
                <label>Trending Deals Boost Multiplier</label>
                <strong>{algoConfig.trendingWeight}x</strong>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={algoConfig.trendingWeight}
                onChange={(e) => setAlgoConfig({ ...algoConfig, trendingWeight: parseFloat(e.target.value) })}
              />
              <small>Scales visibility of deals based on user click acceleration.</small>
            </div>

            <div className="algo-field">
              <div className="algo-label-row">
                <label>Flash Loot Urgency Weight</label>
                <strong>{algoConfig.flashLootBoost}x</strong>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="0.25"
                value={algoConfig.flashLootBoost}
                onChange={(e) => setAlgoConfig({ ...algoConfig, flashLootBoost: parseFloat(e.target.value) })}
              />
              <small>Prioritizes deals with discount &gt; 80% and countdown timers.</small>
            </div>

            <div className="algo-field">
              <div className="algo-label-row">
                <label>Sponsored Brand Multiplier</label>
                <strong>{algoConfig.sponsoredBoost}x</strong>
              </div>
              <input
                type="range"
                min="1"
                max="2"
                step="0.05"
                value={algoConfig.sponsoredBoost}
                onChange={(e) => setAlgoConfig({ ...algoConfig, sponsoredBoost: parseFloat(e.target.value) })}
              />
              <small>Boosts placement for official partner merchant feeds.</small>
            </div>
          </div>
        </div>

        {/* Festival Campaign Overlays */}
        <div className="admin-card">
          <div className="card-header-row">
            <h3>Site-Wide Campaign Overlays</h3>
            <span className="badge-pill">Live Hero Scheduler</span>
          </div>
          <div className="algo-control-group">
            <div className="form-group">
              <label>Active Campaign Name</label>
              <input
                type="text"
                value={algoConfig.activeCampaignName}
                onChange={(e) => setAlgoConfig({ ...algoConfig, activeCampaignName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Campaign Theme & Visual Atmosphere</label>
              <CustomDropdown
                value={algoConfig.campaignTheme}
                onChange={(val: string) => setAlgoConfig({ ...algoConfig, campaignTheme: val })}
                options={[
                  { value: 'Diwali Bonanza', label: '🪔 Diwali Mega Bonanza (Gold & Deep Navy)' },
                  { value: 'Great Indian Sale', label: '🇮🇳 Great Indian Festival' },
                  { value: 'End of Season', label: '❄️ End of Season Clearance' },
                  { value: 'Default Standard', label: '✨ Default Wouchify Standard' }
                ]}
                variant="admin"
              />
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={onPublishAlgorithms}
            >
              Save & Publish Algorithm Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
